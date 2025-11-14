import { Router } from 'express';
import { pool } from '../config/database';
import { HabitsService } from '../services/habits.service';

const router = Router();
const habitsService = new HabitsService();

router.post('/', async (req, res) => {
  const { name, description, target_frequency, color, icon } = req.body;
  const userId = (req as any).user.id;

  const { rows } = await pool.query(
    `INSERT INTO habits (user_id, name, description, target_frequency, color, icon)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, name, description, target_frequency, color, icon]
  );

  res.json(rows[0]);
});

router.get('/', async (req, res) => {
  const userId = (req as any).user.id;
  const { rows } = await pool.query(
    `SELECT * FROM habits WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC`,
    [userId]
  );
  res.json(rows);
});

router.post('/:id/entries', async (req, res) => {
  const { id } = req.params;
  const { entry_date, completed, notes } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO habit_entries (habit_id, entry_date, completed, notes)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (habit_id, entry_date) DO UPDATE SET completed = $3, notes = $4
     RETURNING *`,
    [id, entry_date, completed, notes]
  );

  res.json(rows[0]);
});

router.get('/:id/stats', async (req, res) => {
  const { id } = req.params;
  const { period = 'month' } = req.query;

  const stats = await habitsService.calculateConsistency(parseInt(id), period as any);
  res.json(stats);
});

export default router;
