import { pool } from '../config/database';

export class TaskDelegationService {
  async delegateTask(taskId: number, delegateTo: number[], message?: string) {
    const { rows: [originalTask] } = await pool.query(
      `SELECT * FROM tasks WHERE id = $1`,
      [taskId]
    );

    const delegatedTasks = await Promise.all(
      delegateTo.map(async userId => {
        const { rows } = await pool.query(
          `INSERT INTO tasks (title, description, category_id, priority, due_date, user_id, delegated_from, delegation_message)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [
            originalTask.title,
            originalTask.description,
            originalTask.category_id,
            originalTask.priority,
            originalTask.due_date,
            userId,
            originalTask.user_id,
            message
          ]
        );
        return rows[0];
      })
    );

    return delegatedTasks;
  }

  async getDelegatedTasks(userId: number) {
    const { rows } = await pool.query(
      `SELECT * FROM tasks WHERE delegated_to = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }
}
