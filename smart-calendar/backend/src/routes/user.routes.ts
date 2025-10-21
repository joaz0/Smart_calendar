import { Router, Request, Response } from 'express';
import { pool } from '../config/database';

const router = Router();

// Get user stats
router.get('/stats', async (req: Request, res: Response) => {
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

    const stats = {
      eventsToday: parseInt(eventsResult.rows[0].count),
      pendingTasks: parseInt(tasksResult.rows[0].count),
      completedTasks: parseInt(completedTasksResult.rows[0].count)
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;