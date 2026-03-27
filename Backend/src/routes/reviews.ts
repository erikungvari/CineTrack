import express, { Request, Response } from 'express';
import cassandra from 'cassandra-driver';
import { client } from '../db';

const router = express.Router();

interface ReviewBody {
  title_id: string;
  user_id: string;
  username: string;
  review_text: string;
  rating: number;
}

// POST /api/reviews
router.post('/', async (req: Request<{}, {}, ReviewBody>, res: Response) => {
  try {
    const { title_id, user_id, username, review_text, rating } = req.body;

    if (!title_id || !user_id || !review_text) {
      return res.status(400).json({ error: 'title_id, user_id, and review_text required' });
    }

    const titleId = cassandra.types.Uuid.fromString(title_id);
    const userId = cassandra.types.Uuid.fromString(user_id);

    await client.execute(
      `INSERT INTO reviews_by_title (title_id, created_at, user_id, username, review_text, rating)
       VALUES (?, toTimestamp(now()), ?, ?, ?, ?)`,
      [titleId, userId, username || 'anonymous', review_text, rating || 0],
      { prepare: true }
    );

    res.status(201).json({ message: 'Review created' });
  } catch (err) {
    console.error('POST /api/reviews error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/reviews/:titleId?limit=10&page_state= (Q8)
// Also mounted as GET /api/titles/:id/reviews in index.ts via redirect
router.get('/:titleId', async (req: Request, res: Response) => {
  try {
    const titleId = cassandra.types.Uuid.fromString(req.params.titleId);
    const { limit = 10, page_state } = req.query;

    const options: { prepare: boolean; fetchSize: number; pageState?: string } = {
      prepare: true,
      fetchSize: parseInt(limit as string),
    };
    if (page_state) {
      options.pageState = page_state as string;
    }

    const rs = await client.execute(
      'SELECT * FROM reviews_by_title WHERE title_id = ?',
      [titleId],
      options
    );

    res.json({
      reviews: rs.rows,
      page_state: rs.pageState || null,
    });
  } catch (err) {
    console.error('GET /api/reviews/:titleId error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
