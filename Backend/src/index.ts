import express, { Request, Response } from 'express';
import cors from 'cors';
import cassandra from 'cassandra-driver';
import { client, connect } from './db';

import titlesRouter from './routes/titles';
import usersRouter from './routes/users';
import ratingsRouter from './routes/ratings';
import reviewsRouter from './routes/reviews';
import watchlistRouter from './routes/watchlist';
import watchRouter from './routes/watch';
import analyticsRouter from './routes/analytics';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/titles', titlesRouter);
app.use('/api/users', usersRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/users', watchlistRouter);
app.use('/api/watch', watchRouter);
app.use('/api/analytics', analyticsRouter);

// Convenience aliases matching the spec
app.get('/api/titles/:id/rating', (req: Request, res: Response) => {
  // Q4: average rating for a title - computed from ratings_by_title
  const titleId = cassandra.types.Uuid.fromString(req.params.id);
  client.execute(
    'SELECT rating FROM ratings_by_title WHERE title_id = ?',
    [titleId],
    { prepare: true }
  ).then((rs) => {
    if (rs.rows.length === 0) {
      return res.json({ avg_rating: 0, count: 0 });
    }
    const ratings = rs.rows.map((r) => r.rating as number);
    const avg = ratings.reduce((s, r) => s + r, 0) / ratings.length;
    res.json({ avg_rating: parseFloat(avg.toFixed(1)), count: ratings.length });
  }).catch((err: Error) => res.status(500).json({ error: err.message }));
});

app.get('/api/titles/:id/reviews', (req: Request, res: Response) => {
  const titleId = cassandra.types.Uuid.fromString(req.params.id);
  const { limit = 10, page_state } = req.query;
  const options: { prepare: boolean; fetchSize: number; pageState?: string } = {
    prepare: true,
    fetchSize: parseInt(limit as string),
  };
  if (page_state) options.pageState = page_state as string;
  client.execute(
    'SELECT * FROM reviews_by_title WHERE title_id = ?',
    [titleId],
    options
  ).then((rs) => {
    res.json({ reviews: rs.rows, page_state: rs.pageState || null });
  }).catch((err: Error) => res.status(500).json({ error: err.message }));
});

app.get('/api/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`CineTrack API running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
