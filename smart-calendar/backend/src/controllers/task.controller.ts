import { Request, Response } from 'express';
import { query } from '../config/database';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

class TaskController {
  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autorizado' });
      }

      const result = await query(
        'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      res.json({
        success: true,
        data: {
          data: result.rows || [],
          meta: {
            total: result.rows.length,
            page: 1,
            limit: result.rows.length,
            pages: 1
          }
        }
      });
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Erro ao buscar tarefas' 
      });
    }
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autorizado' });
      }

      const result = await query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Tarefa não encontrada' 
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao buscar tarefa' 
      });
    }
  }

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { title, description, category_id, priority, status, due_date, is_completed } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Não autorizado' 
        });
      }
      
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Título é obrigatório e deve ser uma string válida' 
        });
      }
      
      if (title.length > 255) {
        return res.status(400).json({ 
          success: false,
          error: 'Título deve ter no máximo 255 caracteres' 
        });
      }
      
      const validPriorities = ['low', 'medium', 'high'];
      const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
      
      if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ 
          success: false,
          error: 'Prioridade inválida' 
        });
      }
      
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ 
          success: false,
          error: 'Status inválido' 
        });
      }
      
      const result = await query(
        `INSERT INTO tasks (title, description, category_id, priority, status, due_date, is_completed, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *`,
            [title.trim(), description?.trim(), category_id, priority || 'medium', status || 'pending', due_date, is_completed || false, userId]
      );
      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating task:', error);
      if (error instanceof Error && error.message.includes('foreign key')) {
        return res.status(400).json({ 
          success: false,
          error: 'Categoria inválida' 
        });
      }
      res.status(500).json({ 
        success: false,
        error: 'Erro interno do servidor' 
      });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, category_id, priority, status, due_date, is_completed } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autorizado' });
      }

      const result = await query(
        `UPDATE tasks
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             category_id = COALESCE($3, category_id),
             priority = COALESCE($4, priority),
             status = COALESCE($5, status),
             due_date = COALESCE($6, due_date),
             is_completed = COALESCE($7, is_completed),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $8 AND user_id = $9
         RETURNING *`,
        [title, description, category_id, priority, status, due_date, is_completed, id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Tarefa não encontrada' 
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao atualizar tarefa' 
      });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autorizado' });
      }

      const result = await query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Tarefa não encontrada' 
        });
      }
      res.json({
        success: true
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao deletar tarefa' 
      });
    }
  }

  async search(req: AuthenticatedRequest, res: Response) {
    try {
      const { q } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autorizado' });
      }

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ 
          success: false,
          error: 'Parâmetro de busca inválido' 
        });
      }
      const result = await query(
        `SELECT * FROM tasks WHERE user_id = $1 AND (title ILIKE $2 OR description ILIKE $2) ORDER BY created_at DESC LIMIT 20`,
        [userId, `%${q}%`]
      );
      res.json({
        success: true,
        data: {
          data: result.rows,
          meta: {
            total: result.rows.length,
            page: 1,
            limit: 20,
            pages: 1
          }
        }
      });
    } catch (error) {
      console.error('Error searching tasks:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao buscar tarefas' 
      });
    }
  }
}

export default new TaskController();
