import express, { Request, Response } from 'express';
import { client } from '../db';

const router = express.Router();

// GET /api/analytics/trending?genre=&months=1 (Q6)
router.get('/trending', async (req: Request, res: Response) => {
  try {
    const { genre, months = 1 } = req.query;

    if (!genre) {
      return res.status(400).json({ error: 'genre query parameter required' });
    }

    // Generate month keys for the requested period
    const monthKeys: string[] = [];
    const now = new Date();
    for (let i = 0; i < parseInt(months as string); i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthKeys.push(key);
    }

    // Aggregate watch counts across months
    const titleCounts: Record<string, number> = {};
    for (const month of monthKeys) {
      const rs = await client.execute(
        'SELECT title_id, watch_count FROM title_popularity WHERE genre = ? AND month = ?',
        [genre, month],
        { prepare: true }
      );
      for (const row of rs.rows) {
        const id = row.title_id.toString();
        titleCounts[id] = (titleCounts[id] || 0) + (row.watch_count ? row.watch_count.toNumber() : 0);
      }
    }

    // Sort by watch_count descending and take top 10
    const sorted = Object.entries(titleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Enrich with title info
    const trending: Record<string, unknown>[] = [];
    for (const [titleId, watchCount] of sorted) {
      // Find title info from titles_by_genre
      const genres = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror', 'Thriller', 'Romance', 'Documentary'];
      let titleInfo: Record<string, unknown> | null = null;
      for (const g of genres) {
        const rs = await client.execute(
          'SELECT * FROM titles_by_genre WHERE genre = ? AND title_id = ?',
          [g, titleId],
          { prepare: true }
        );
        if (rs.rows.length > 0) {
          titleInfo = rs.rows[0] as unknown as Record<string, unknown>;
          break;
        }
      }
      trending.push({
        title_id: titleId,
        watch_count: watchCount,
        ...(titleInfo || {}),
      });
    }

    res.json({ trending, genre, months: parseInt(months as string) });
  } catch (err) {
    console.error('GET /api/analytics/trending error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
