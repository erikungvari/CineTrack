import express, { Request, Response } from 'express';
import cassandra from 'cassandra-driver';
import { client } from '../db';

const router = express.Router();

interface WatchBody {
  user_id: string;
  title_id: string;
  title: string;
  genre: string;
  progress_s: number;
  completed: boolean;
}

// POST /api/watch - record watch progress
router.post('/', async (req: Request<{}, {}, WatchBody>, res: Response) => {
  try {
    const { user_id, title_id, title, genre, progress_s, completed } = req.body;

    if (!user_id || !title_id) {
      return res.status(400).json({ error: 'user_id and title_id required' });
    }

    const userId = cassandra.types.Uuid.fromString(user_id);
    const titleId = cassandra.types.Uuid.fromString(title_id);
    const now = new Date();
    const isCompleted = completed || false;

    // Write to watch_history_by_user
    await client.execute(
      `INSERT INTO watch_history_by_user (user_id, watched_at, title_id, title, genre, progress_s, completed)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, now, titleId, title || '', genre || '', progress_s || 0, isCompleted],
      { prepare: true }
    );

    // Write to watch_progress (upsert)
    await client.execute(
      `INSERT INTO watch_progress (user_id, title_id, progress_s, updated_at, completed)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, titleId, progress_s || 0, now, isCompleted],
      { prepare: true }
    );

    // Update COUNTER table for popularity
    if (genre) {
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      await client.execute(
        'UPDATE title_popularity SET watch_count = watch_count + 1 WHERE genre = ? AND month = ? AND title_id = ?',
        [genre, month, titleId],
        { prepare: true }
      );
    }

    res.json({ message: 'Watch progress recorded' });
  } catch (err) {
    console.error('POST /api/watch error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
