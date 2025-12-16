import { Request, Response } from 'express';
import { query } from '../config/database';

export class AiCommandsController {
  async create(req: Request, res: Response) {
    try {
      const { user_id, raw_text, intent, entities, confidence } = req.body;
      if (!raw_text) return res.status(400).json({ error: 'raw_text é obrigatório' });

      const result = await query(
        `INSERT INTO ai_commands (user_id, raw_text, intent, entities, confidence) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          user_id || null,
          raw_text,
          intent || null,
          entities ? JSON.stringify(entities) : null,
          confidence || null,
        ]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating ai command:', error);
      res.status(500).json({ error: 'Erro ao criar ai command' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      if (userId) {
        const result = await query(
          'SELECT * FROM ai_commands WHERE user_id = $1 ORDER BY created_at DESC',
          [userId]
        );
        return res.json(result.rows);
      }
      const result = await query('SELECT * FROM ai_commands ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error listing ai commands:', error);
      res.status(500).json({ error: 'Erro ao listar ai commands' });
    }
  }
}

export default new AiCommandsController();
