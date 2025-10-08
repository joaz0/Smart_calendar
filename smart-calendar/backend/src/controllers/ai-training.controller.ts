import { Request, Response } from 'express';
import { pool } from '../config/database';

export class AiTrainingController {
  async listDatasets(req: Request, res: Response) {
    try {
      const result = await pool.query(
        'SELECT * FROM ai_training_datasets ORDER BY created_at DESC'
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error listing AI datasets:', error);
      res.status(500).json({ error: 'Erro ao listar datasets' });
    }
  }

  async getDataset(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ds = await pool.query('SELECT * FROM ai_training_datasets WHERE id = $1', [id]);
      if (ds.rows.length === 0) return res.status(404).json({ error: 'Dataset não encontrado' });

      const examples = await pool.query(
        'SELECT * FROM ai_training_examples WHERE dataset_id = $1 ORDER BY created_at DESC',
        [id]
      );
      res.json({ ...ds.rows[0], examples: examples.rows });
    } catch (error) {
      console.error('Error getting dataset:', error);
      res.status(500).json({ error: 'Erro ao buscar dataset' });
    }
  }

  async createDataset(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      if (!name) return res.status(400).json({ error: 'Name é obrigatório' });

      const result = await pool.query(
        'INSERT INTO ai_training_datasets (name, description) VALUES ($1, $2) RETURNING *',
        [name, description]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating dataset:', error);
      res.status(500).json({ error: 'Erro ao criar dataset' });
    }
  }

  async addExample(req: Request, res: Response) {
    try {
      const { datasetId } = req.params;
      const { input, output, label, metadata } = req.body;
      if (!input || !output)
        return res.status(400).json({ error: 'input e output são obrigatórios' });

      const result = await pool.query(
        `INSERT INTO ai_training_examples (dataset_id, input, output, label, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [datasetId, input, output, label || null, metadata ? JSON.stringify(metadata) : null]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding example:', error);
      res.status(500).json({ error: 'Erro ao adicionar exemplo' });
    }
  }

  async listExamples(req: Request, res: Response) {
    try {
      const { datasetId } = req.params;
      const result = await pool.query(
        'SELECT * FROM ai_training_examples WHERE dataset_id = $1 ORDER BY created_at DESC',
        [datasetId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error listing examples:', error);
      res.status(500).json({ error: 'Erro ao listar exemplos' });
    }
  }
}

export default new AiTrainingController();
