import { Request, Response } from 'express';
import { pool } from '../config/database';

export class ProductivityController {
  async list(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      if (userId) {
        const result = await pool.query(
          'SELECT * FROM productivity_scores WHERE user_id = $1 ORDER BY date DESC',
          [userId]
        );
        return res.json(result.rows);
      }
      const result = await pool.query('SELECT * FROM productivity_scores ORDER BY date DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error listing productivity scores:', error);
      res.status(500).json({ error: 'Erro ao listar productivity scores' });
    }
  }

  async upsert(req: Request, res: Response) {
    try {
      const { date, user_id, score, components, insights } = req.body;
      if (!date || !user_id || score === undefined)
        return res.status(400).json({ error: 'date, user_id e score são obrigatórios' });

      const existing = await pool.query(
        'SELECT id FROM productivity_scores WHERE date = $1 AND user_id = $2',
        [date, user_id]
      );
      if (existing.rows.length > 0) {
        const id = existing.rows[0].id;
        const result = await pool.query(
          `UPDATE productivity_scores SET score = $1, components = $2, insights = $3, created_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
          [score, JSON.stringify(components || null), JSON.stringify(insights || null), id]
        );
        return res.json(result.rows[0]);
      }

      const result = await pool.query(
        `INSERT INTO productivity_scores (date, user_id, score, components, insights) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [date, user_id, score, JSON.stringify(components || null), JSON.stringify(insights || null)]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error upserting productivity score:', error);
      res.status(500).json({ error: 'Erro ao inserir/atualizar productivity score' });
    }
  }
}

export default new ProductivityController();
