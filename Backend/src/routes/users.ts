import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import cassandra from 'cassandra-driver';
import { client } from '../db';

const router = express.Router();

interface RegisterBody {
  username: string;
  email: string;
}

// POST /api/users/register
router.post('/register', async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ error: 'username and email required' });
    }

    const userId = cassandra.types.Uuid.fromString(uuidv4());
    await client.execute(
      'INSERT INTO users (user_id, username, email, created_at) VALUES (?, ?, ?, toTimestamp(now()))',
      [userId, username, email],
      { prepare: true }
    );

    res.status(201).json({ user_id: userId.toString(), username, email });
  } catch (err) {
    console.error('POST /api/users/register error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/users/:id/history?limit=20&page_state=
router.get('/:id/history', async (req: Request, res: Response) => {
  try {
    const userId = cassandra.types.Uuid.fromString(req.params.id);
    const { limit = 20, page_state } = req.query;

    const options: { prepare: boolean; fetchSize: number; pageState?: string } = {
      prepare: true,
      fetchSize: parseInt(limit as string),
    };
    if (page_state) {
      options.pageState = page_state as string;
    }

    const rs = await client.execute(
      'SELECT * FROM watch_history_by_user WHERE user_id = ?',
      [userId],
      options
    );

    res.json({
      history: rs.rows,
      page_state: rs.pageState || null,
    });
  } catch (err) {
    console.error('GET /api/users/:id/history error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/users/:id/progress/:titleId
router.get('/:id/progress/:titleId', async (req: Request, res: Response) => {
  try {
    const userId = cassandra.types.Uuid.fromString(req.params.id);
    const titleId = cassandra.types.Uuid.fromString(req.params.titleId);

    const rs = await client.execute(
      'SELECT * FROM watch_progress WHERE user_id = ? AND title_id = ?',
      [userId, titleId],
      { prepare: true }
    );

    if (rs.rows.length === 0) {
      return res.json({ progress_s: 0, completed: false });
    }

    res.json(rs.rows[0]);
  } catch (err) {
    console.error('GET /api/users/:id/progress/:titleId error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/users/:id/recommendations
router.get('/:id/recommendations', async (req: Request, res: Response) => {
  try {
    const userId = cassandra.types.Uuid.fromString(req.params.id);

    // Get user's watch history to find preferred genres
    const historyRs = await client.execute(
      'SELECT genre, title_id FROM watch_history_by_user WHERE user_id = ? LIMIT 50',
      [userId],
      { prepare: true }
    );

    if (historyRs.rows.length === 0) {
      // No history -> return popular titles from various genres
      const rs = await client.execute(
        'SELECT * FROM titles_by_genre WHERE genre = ? LIMIT 10',
        ['Action'],
        { prepare: true }
      );
      return res.json({ recommendations: rs.rows, strategy: 'popular' });
    }

    // Count genre frequency
    const genreCounts: Record<string, number> = {};
    const watchedIds = new Set<string>();
    for (const row of historyRs.rows) {
      genreCounts[row.genre] = (genreCounts[row.genre] || 0) + 1;
      watchedIds.add(row.title_id.toString());
    }

    // Sort genres by frequency
    const sortedGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([genre]) => genre);

    // Get titles from top genres that user hasn't watched
    const recommendations: cassandra.types.Row[] = [];
    for (const genre of sortedGenres.slice(0, 3)) {
      const rs = await client.execute(
        'SELECT * FROM titles_by_genre WHERE genre = ? LIMIT 20',
        [genre],
        { prepare: true }
      );
      for (const row of rs.rows) {
        if (!watchedIds.has(row.title_id.toString())) {
          recommendations.push(row);
        }
      }
    }

    res.json({
      recommendations: recommendations.slice(0, 10),
      strategy: 'genre-based',
      top_genres: sortedGenres.slice(0, 3),
    });
  } catch (err) {
    console.error('GET /api/users/:id/recommendations error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/users/:id - get user profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = cassandra.types.Uuid.fromString(req.params.id);
    const rs = await client.execute(
      'SELECT * FROM users WHERE user_id = ?',
      [userId],
      { prepare: true }
    );
    if (rs.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rs.rows[0]);
  } catch (err) {
    console.error('GET /api/users/:id error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
