import { Router, Request, Response } from 'express';
import { pool } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const mapUserProfile = (row: any) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  avatar: row.avatar ?? null,
  preferences: row.preferences || {},
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  created_at: row.created_at,
  updated_at: row.updated_at
});

// Get user stats
router.get('/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [eventsResult, tasksResult, completedTasksResult] = await Promise.all([
      pool.query(
        'SELECT COUNT(*) FROM events WHERE start_time >= $1 AND start_time <= $2',
        [startOfDay, endOfDay]
      ),
      pool.query('SELECT COUNT(*) FROM tasks WHERE is_completed = false'),
      pool.query('SELECT COUNT(*) FROM tasks WHERE is_completed = true')
    ]);

    const eventsToday = parseInt(eventsResult.rows[0].count, 10);
    const pendingTasks = parseInt(tasksResult.rows[0].count, 10);
    const completedTasks = parseInt(completedTasksResult.rows[0].count, 10);
    const totalTasks = pendingTasks + completedTasks;
    const productivityScore = totalTasks > 0 ? Math.round((completedTasks * 100) / totalTasks) : 0;

    res.json({
      events_today: eventsToday,
      pending_tasks: pendingTasks,
      completed_tasks: completedTasks,
      productivity_score: productivityScore,
      eventsToday,
      pendingTasks,
      completedTasks,
      productivityScore
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    const result = await pool.query(
      'SELECT id, name, email, avatar, preferences, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    res.json(mapUserProfile(result.rows[0]));
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update user profile
router.patch('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    const { name, email, avatar, preferences } = req.body;
    const hasUpdates = name !== undefined || email !== undefined || avatar !== undefined || preferences !== undefined;

    if (!hasUpdates) {
      return res.status(400).json({ error: 'Nenhum dado para atualizar' });
    }

    if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
      return res.status(400).json({ error: 'Nome invalido' });
    }

    if (email !== undefined) {
      if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Email invalido' });
      }

      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id <> $2',
        [email, userId]
      );
      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'Email ja cadastrado' });
      }
    }

    if (avatar !== undefined && avatar !== null && typeof avatar !== 'string') {
      return res.status(400).json({ error: 'Avatar invalido' });
    }

    if (preferences !== undefined && !isPlainObject(preferences)) {
      return res.status(400).json({ error: 'Preferencias invalidas' });
    }

    let mergedPreferences: Record<string, unknown> | undefined;
    if (preferences !== undefined) {
      const currentPrefs = await pool.query('SELECT preferences FROM users WHERE id = $1', [userId]);
      const existingPrefs = currentPrefs.rows[0]?.preferences || {};
      mergedPreferences = { ...existingPrefs, ...preferences };
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push(`name = $${values.length + 1}`);
      values.push(name.trim());
    }

    if (email !== undefined) {
      updates.push(`email = $${values.length + 1}`);
      values.push(email.trim());
    }

    if (avatar !== undefined) {
      updates.push(`avatar = $${values.length + 1}`);
      values.push(avatar);
    }

    if (preferences !== undefined) {
      updates.push(`preferences = $${values.length + 1}`);
      values.push(mergedPreferences || {});
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${values.length}
       RETURNING id, name, email, avatar, preferences, created_at, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    res.json(mapUserProfile(result.rows[0]));
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete user account
router.delete('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get user preferences
router.get('/preferences', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    const result = await pool.query('SELECT preferences FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    res.json(result.rows[0].preferences || {});
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update user preferences
router.patch('/preferences', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    if (!isPlainObject(req.body)) {
      return res.status(400).json({ error: 'Preferencias invalidas' });
    }

    const currentPrefs = await pool.query('SELECT preferences FROM users WHERE id = $1', [userId]);
    const existingPrefs = currentPrefs.rows[0]?.preferences || {};
    const updatedPrefs = { ...existingPrefs, ...req.body };

    const result = await pool.query(
      'UPDATE users SET preferences = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING preferences',
      [updatedPrefs, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    res.json(result.rows[0].preferences || {});
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
