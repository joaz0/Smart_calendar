import { Request, Response } from 'express';
import { pool } from '../config/database';

export class TaskController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await pool.query(
        'SELECT * FROM tasks ORDER BY created_at DESC'
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({ error: 'Erro ao buscar tarefa' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { title, description, category, priority, status, due_date, completed } = req.body;
      if (!title || !category) {
        return res.status(400).json({ error: 'Título e categoria são obrigatórios' });
      }
      const result = await pool.query(
        `INSERT INTO tasks (title, description, category, priority, status, due_date, completed)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *`,
            [title, description, category, priority || 'medium', status || 'pending', due_date, completed || false]
      );
      res.status(201).json(result.rows[0]
      );
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, category, priority, status, due_date, completed } = req.body;

      const result = await pool.query(
        `UPDATE tasks
         SET title = $1,
             description = $2,
             category = $3,
             priority = $4,
             status = $5,
             due_date = $6,
             completed = $7,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [title, description, category, priority, status, due_date, completed, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Erro ao deletar tarefa' });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Parâmetro de busca inválido' });
      }
      const result = await pool.query(
        `SELECT * FROM tasks WHERE to_tsvector('portuguese', title) @@ plainto_tsquery('portuguese', $1)`,
        [q]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error searching tasks:', error);
      res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
  }
}