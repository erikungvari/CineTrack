import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import cassandra from 'cassandra-driver';
import { client } from '../db';

const router = express.Router();

interface CreateTitleBody {
  genre: string;
  title: string;
  year: number;
  type: string;
  duration_s: number;
  director: string;
  cast_list: string[];
  description: string;
  poster_url: string;
}

// GET /api/titles?genre=&limit=&page_state=
router.get('/', async (req: Request, res: Response) => {
  try {
    const { genre, limit = 20, page_state } = req.query;

    if (!genre) {
      // Return all genres with titles
      const genres = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror', 'Thriller', 'Romance', 'Documentary'];
      const result: Record<string, cassandra.types.Row[]> = {};
      for (const g of genres) {
        const rs = await client.execute(
          'SELECT * FROM titles_by_genre WHERE genre = ? LIMIT ?',
          [g, parseInt(limit as string)],
          { prepare: true }
        );
        if (rs.rows.length > 0) {
          result[g] = rs.rows;
        }
      }
      return res.json({ titles: result });
    }

    const options: { prepare: boolean; fetchSize: number; pageState?: string } = {
      prepare: true,
      fetchSize: parseInt(limit as string),
    };
    if (page_state) {
      options.pageState = page_state as string;
    }

    const rs = await client.execute(
      'SELECT * FROM titles_by_genre WHERE genre = ?',
      [genre],
      options
    );

    res.json({
      titles: rs.rows,
      page_state: rs.pageState || null,
    });
  } catch (err) {
    console.error('GET /api/titles error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/titles/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const titleId = cassandra.types.Uuid.fromString(req.params.id);
    // Search across all genres (denormalized - need to scan)
    const genres = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror', 'Thriller', 'Romance', 'Documentary'];
    for (const genre of genres) {
      const rs = await client.execute(
        'SELECT * FROM titles_by_genre WHERE genre = ? AND title_id = ?',
        [genre, titleId],
        { prepare: true }
      );
      if (rs.rows.length > 0) {
        return res.json(rs.rows[0]);
      }
    }
    res.status(404).json({ error: 'Title not found' });
  } catch (err) {
    console.error('GET /api/titles/:id error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/titles
router.post('/', async (req: Request<{}, {}, CreateTitleBody>, res: Response) => {
  try {
    const { genre, title, year, type, duration_s, director, cast_list, description, poster_url } = req.body;
    const titleId = cassandra.types.Uuid.fromString(uuidv4());

    await client.execute(
      `INSERT INTO titles_by_genre (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [genre, titleId, title, year, type, duration_s, director, cast_list || [], description, poster_url],
      { prepare: true }
    );

    res.status(201).json({ title_id: titleId.toString(), message: 'Title created' });
  } catch (err) {
    console.error('POST /api/titles error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
