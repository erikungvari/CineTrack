import express, { Request, Response } from 'express';
import cassandra from 'cassandra-driver';
import { client } from '../db';

const router = express.Router();

interface RatingBody {
  user_id: string;
  title_id: string;
  rating: number;
}

// POST /api/ratings - write-to-both pattern
router.post('/', async (req: Request<{}, {}, RatingBody>, res: Response) => {
  try {
    const { user_id, title_id, rating } = req.body;

    if (!user_id || !title_id || rating == null) {
      return res.status(400).json({ error: 'user_id, title_id, and rating required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const userId = cassandra.types.Uuid.fromString(user_id);
    const titleId = cassandra.types.Uuid.fromString(title_id);
    const now = new Date();

    // Write-to-both pattern: ratings_by_user + ratings_by_title
    const batch = [
      {
        query: 'INSERT INTO ratings_by_user (user_id, title_id, rating, rated_at) VALUES (?, ?, ?, ?)',
        params: [userId, titleId, rating, now],
      },
      {
        query: 'INSERT INTO ratings_by_title (title_id, user_id, rating, rated_at) VALUES (?, ?, ?, ?)',
        params: [titleId, userId, rating, now],
      },
    ];

    await client.batch(batch, { prepare: true });

    // Recompute avg_rating for the title and update titles_by_genre
    const ratingsRs = await client.execute(
      'SELECT rating FROM ratings_by_title WHERE title_id = ?',
      [titleId],
      { prepare: true }
    );

    const ratings = ratingsRs.rows.map((r) => r.rating as number);
    const avgRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;

    // Update avg_rating in titles_by_genre (need to find the genre first)
    const genres = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror', 'Thriller', 'Romance', 'Documentary'];
    for (const genre of genres) {
      const titleRs = await client.execute(
        'SELECT title_id FROM titles_by_genre WHERE genre = ? AND title_id = ?',
        [genre, titleId],
        { prepare: true }
      );
      if (titleRs.rows.length > 0) {
        await client.execute(
          'UPDATE titles_by_genre SET avg_rating = ? WHERE genre = ? AND title_id = ?',
          [parseFloat(avgRating.toFixed(1)), genre, titleId],
          { prepare: true }
        );
        break;
      }
    }

    res.json({ message: 'Rating saved', avg_rating: parseFloat(avgRating.toFixed(1)) });
  } catch (err) {
    console.error('POST /api/ratings error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/ratings/user/:userId/:titleId - get user's rating for a title (Q3)
router.get('/user/:userId/:titleId', async (req: Request, res: Response) => {
  try {
    const userId = cassandra.types.Uuid.fromString(req.params.userId);
    const titleId = cassandra.types.Uuid.fromString(req.params.titleId);

    const rs = await client.execute(
      'SELECT * FROM ratings_by_user WHERE user_id = ? AND title_id = ?',
      [userId, titleId],
      { prepare: true }
    );

    if (rs.rows.length === 0) {
      return res.json({ rating: null });
    }
    res.json(rs.rows[0]);
  } catch (err) {
    console.error('GET /api/ratings error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
