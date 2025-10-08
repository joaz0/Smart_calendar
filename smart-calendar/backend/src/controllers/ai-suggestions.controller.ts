import { Request, Response } from 'express';
import { pool } from '../config/database';

export class AiSuggestionsController {
  async list(req: Request, res: Response) {
    try {
      const result = await pool.query('SELECT * FROM ai_suggestions ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error listing AI suggestions:', error);
      res.status(500).json({ error: 'Erro ao listar sugestões' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { user_id, payload, score } = req.body;
      if (!payload) return res.status(400).json({ error: 'payload é obrigatório' });

      const result = await pool.query(
        `INSERT INTO ai_suggestions (user_id, payload, score) VALUES ($1, $2, $3) RETURNING *`,
        [user_id || null, JSON.stringify(payload), score || null]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating AI suggestion:', error);
      res.status(500).json({ error: 'Erro ao criar sugestão' });
    }
  }
}

export default new AiSuggestionsController();
