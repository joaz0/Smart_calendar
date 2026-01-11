import { Request, Response } from 'express';
import { query } from '../config/database';

class EventController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await query('SELECT * FROM events ORDER BY created_at DESC');
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
      console.error('Error fetching events:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Erro ao buscar eventos' 
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await query('SELECT * FROM events WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Evento não encontrado' 
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao buscar evento' 
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { title, description, start_time, end_time, location, category_id, is_all_day } = req.body;

      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Título é obrigatório e deve ser uma string válida' 
        });
      }
      
      if (!start_time) {
        return res.status(400).json({ 
          success: false,
          error: 'Data de início é obrigatória' 
        });
      }
      
      if (title.length > 255) {
        return res.status(400).json({ 
          success: false,
          error: 'Título deve ter no máximo 255 caracteres' 
        });
      }

      const result = await query(
        `INSERT INTO events (title, description, start_time, end_time, location, category_id, is_all_day)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [title.trim(), description?.trim(), start_time, end_time, location?.trim(), category_id, is_all_day || false]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating event:', error);
      if (error instanceof Error && error.message.includes('foreign key')) {
        return res.status(400).json({ 
          success: false,
          error: 'Categoria inválida' 
        });
      }
      if (error instanceof Error && error.message.includes('invalid input syntax')) {
        return res.status(400).json({ 
          success: false,
          error: 'Formato de data inválido' 
        });
      }
      res.status(500).json({ 
        success: false,
        error: 'Erro interno do servidor' 
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, start_time, end_time, location, category_id, is_all_day } = req.body;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ 
          success: false,
          error: 'ID do evento inválido' 
        });
      }
      
      if (title && (typeof title !== 'string' || title.trim().length === 0)) {
        return res.status(400).json({ 
          success: false,
          error: 'Título deve ser uma string válida' 
        });
      }
      
      if (title && title.length > 255) {
        return res.status(400).json({ 
          success: false,
          error: 'Título deve ter no máximo 255 caracteres' 
        });
      }

      const result = await query(
        `UPDATE events
         SET title = COALESCE($1, title), 
             description = COALESCE($2, description), 
             start_time = COALESCE($3, start_time), 
             end_time = COALESCE($4, end_time),
             location = COALESCE($5, location), 
             category_id = COALESCE($6, category_id), 
             is_all_day = COALESCE($7, is_all_day), 
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [title?.trim(), description?.trim(), start_time, end_time, location?.trim(), category_id, is_all_day, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Evento não encontrado' 
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating event:', error);
      if (error instanceof Error && error.message.includes('foreign key')) {
        return res.status(400).json({ 
          success: false,
          error: 'Categoria inválida' 
        });
      }
      if (error instanceof Error && error.message.includes('invalid input syntax')) {
        return res.status(400).json({ 
          success: false,
          error: 'Formato de data inválido' 
        });
      }
      res.status(500).json({ 
        success: false,
        error: 'Erro interno do servidor' 
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Evento não encontrado' 
        });
      }

      res.json({
        success: true
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao deletar evento' 
      });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({ 
          success: false,
          error: 'Query parameter "q" é obrigatório' 
        });
      }

      const result = await query(
        `SELECT * FROM events
         WHERE title ILIKE $1 OR description ILIKE $1
         ORDER BY start_time DESC
         LIMIT 10`,
        [`%${q}%`]
      );

      res.json({
        success: true,
        data: {
          data: result.rows,
          meta: {
            total: result.rows.length,
            page: 1,
            limit: 10,
            pages: 1
          }
        }
      });
    } catch (error) {
      console.error('Error searching events:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao buscar eventos' 
      });
    }
  }
}

export default new EventController();
