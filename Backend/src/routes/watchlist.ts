import express, { Request, Response } from 'express';
import cassandra from 'cassandra-driver';
import { client } from '../db';

const router = express.Router();

interface WatchlistBody {
  title_id: string;
  title: string;
  genre: string;
}

// POST /api/users/:id/watchlist
router.post('/:id/watchlist', async (req: Request<{ id: string }, {}, WatchlistBody>, res: Response) => {
  try {
    const userId = cassandra.types.Uuid.fromString(req.params.id);
    const { title_id, title, genre } = req.body;

    if (!title_id) {
      return res.status(400).json({ error: 'title_id required' });
    }

    const titleId = cassandra.types.Uuid.fromString(title_id);

    await client.execute(
      `INSERT INTO watchlist_by_user (user_id, added_at, title_id, title, genre)
       VALUES (?, toTimestamp(now()), ?, ?, ?)`,
      [userId, titleId, title || '', genre || ''],
      { prepare: true }
    );

    res.status(201).json({ message: 'Added to watchlist' });
  } catch (err) {
    console.error('POST watchlist error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/users/:id/watchlist (Q5)
router.get('/:id/watchlist', async (req: Request, res: Response) => {
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
      'SELECT * FROM watchlist_by_user WHERE user_id = ?',
      [userId],
      options
    );

    res.json({
      watchlist: rs.rows,
      page_state: rs.pageState || null,
    });
  } catch (err) {
    console.error('GET watchlist error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// DELETE /api/users/:id/watchlist/:titleId
router.delete('/:id/watchlist/:titleId', async (req: Request, res: Response) => {
  try {
    const userId = cassandra.types.Uuid.fromString(req.params.id);
    const titleId = cassandra.types.Uuid.fromString(req.params.titleId);

    // Find the entry to delete (need added_at for the clustering key)
    const rs = await client.execute(
      'SELECT added_at FROM watchlist_by_user WHERE user_id = ?',
      [userId],
      { prepare: true }
    );

    let deleted = false;
    for (const row of rs.rows) {
      // Check each entry for matching title_id
      const checkRs = await client.execute(
        'SELECT title_id FROM watchlist_by_user WHERE user_id = ? AND added_at = ? AND title_id = ?',
        [userId, row.added_at, titleId],
        { prepare: true }
      );
      if (checkRs.rows.length > 0) {
        await client.execute(
          'DELETE FROM watchlist_by_user WHERE user_id = ? AND added_at = ? AND title_id = ?',
          [userId, row.added_at, titleId],
          { prepare: true }
        );
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      return res.status(404).json({ error: 'Title not found in watchlist' });
    }

    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    console.error('DELETE watchlist error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
