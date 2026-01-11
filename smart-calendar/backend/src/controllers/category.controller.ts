import { Request, Response } from 'express';
import { query } from '../config/database';

class CategoryController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await query('SELECT * FROM categories ORDER BY name ASC');
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

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await query('SELECT * FROM categories WHERE id = $1', [id]);

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

  async create(req: Request, res: Response) {
    try {
      const { name, color, description } = req.body;

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
        'INSERT INTO categories (name, color, description) VALUES ($1, $2, $3) RETURNING *',
        [name.trim(), color, description?.trim()]
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

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, color, description } = req.body;

      const result = await query(
        `UPDATE categories 
         SET name = COALESCE($1, name), 
             color = COALESCE($2, color), 
             description = COALESCE($3, description), 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $4 
         RETURNING *`,
        [name?.trim(), color, description?.trim(), id]
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

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);

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
