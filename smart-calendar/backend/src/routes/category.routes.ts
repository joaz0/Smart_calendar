import { Router, Request, Response } from 'express';
const { body, validationResult } = require('express-validator');
import { pool } from '../config/database';

const router = Router();

// Get all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Create category
router.post('/', [
  body('name').trim().isLength({ min: 1 }),
  body('color').matches(/^#[0-9A-F]{6}$/i)
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, color, description } = req.body;

    const result = await pool.query(
      'INSERT INTO categories (name, color, description) VALUES ($1, $2, $3) RETURNING *',
      [name, color, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update category
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color, description } = req.body;

    const result = await pool.query(
      'UPDATE categories SET name = $1, color = $2, description = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, color, description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete category
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;