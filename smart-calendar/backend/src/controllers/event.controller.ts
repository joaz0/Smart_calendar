import { Request, Response } from 'express';
import { pool } from '../config/database';

export class EventController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await pool.query(
        'SELECT * FROM events ORDER BY start_date DESC'
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Erro ao buscar eventos' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ error: 'Erro ao buscar evento' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { title, description, start_date, end_date, location, category, color } = req.body;

      if (!title || !start_date) {
        return res.status(400).json({ error: 'Título e data de início são obrigatórios' });
      }

      const result = await pool.query(
        `INSERT INTO events (title, description, start_date, end_date, location, category, color)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [title, description, start_date, end_date, location, category, color]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Erro ao criar evento' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, start_date, end_date, location, category, color } = req.body;

      const result = await pool.query(
        `UPDATE events
         SET title = $1, description = $2, start_date = $3, end_date = $4,
             location = $5, category = $6, color = $7, updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [title, description, start_date, end_date, location, category, color, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Erro ao atualizar evento' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Erro ao deletar evento' });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" é obrigatório' });
      }

      const result = await pool.query(
        `SELECT * FROM events
         WHERE title ILIKE $1 OR description ILIKE $1
         ORDER BY start_date DESC
         LIMIT 10`,
        [`%${q}%`]
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error searching events:', error);
      res.status(500).json({ error: 'Erro ao buscar eventos' });
    }
  }
}
