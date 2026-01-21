import { Request, Response } from 'express';
import { query } from '../config/database';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

class CategoryController {
  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autorizado' });
      }

      const result = await query('SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC', [userId]);
      res.json({
        success: true,
        data: result.rows || []
      });
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Erro ao buscar categorias' 
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

      const result = await query('SELECT * FROM categories WHERE id = $1 AND user_id = $2', [id, userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Categoria não encontrada' 
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao buscar categoria' 
      });
    }
  }

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, color, description } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autorizado' });
      }

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Nome é obrigatório' 
        });
      }

      if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
        return res.status(400).json({ 
          success: false,
          error: 'Cor inválida (use formato #RRGGBB)' 
        });
      }

      const result = await query(
        'INSERT INTO categories (name, color, description, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [name.trim(), color, description?.trim(), userId]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro interno do servidor' 
      });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, color, description } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autorizado' });
      }

      const result = await query(
        `UPDATE categories 
         SET name = COALESCE($1, name), 
             color = COALESCE($2, color), 
             description = COALESCE($3, description), 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $4 AND user_id = $5
         RETURNING *`,
        [name?.trim(), color, description?.trim(), id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Categoria não encontrada' 
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro interno do servidor' 
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

      const result = await query('DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Categoria não encontrada' 
        });
      }

      res.json({
        success: true
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao deletar categoria' 
      });
    }
  }
}

export default new CategoryController();
