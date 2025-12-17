import { Request, Response } from 'express';
import { query } from '../config/database';

class TaskController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await query(
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
      const result = await query('SELECT * FROM tasks WHERE id = $1', [id]);

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
      const { title, description, category_id, priority, status, due_date, is_completed } = req.body;
      
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'Título é obrigatório e deve ser uma string válida' });
      }
      
      if (title.length > 255) {
        return res.status(400).json({ error: 'Título deve ter no máximo 255 caracteres' });
      }
      
      const validPriorities = ['low', 'medium', 'high'];
      const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
      
      if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Prioridade inválida' });
      }
      
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }
      
      const result = await query(
        `INSERT INTO tasks (title, description, category_id, priority, status, due_date, is_completed)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *`,
            [title.trim(), description?.trim(), category_id, priority || 'medium', status || 'pending', due_date, is_completed || false]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating task:', error);
      if (error instanceof Error && error.message.includes('foreign key')) {
        return res.status(400).json({ error: 'Categoria inválida' });
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, category_id, priority, status, due_date, is_completed } = req.body;

      const result = await query(
        `UPDATE tasks
         SET title = $1,
             description = $2,
             category_id = $3,
             priority = $4,
             status = $5,
             due_date = $6,
             is_completed = $7,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [title, description, category_id, priority, status, due_date, is_completed, id]
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
      const result = await query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
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
      const result = await query(
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

export default new TaskController();