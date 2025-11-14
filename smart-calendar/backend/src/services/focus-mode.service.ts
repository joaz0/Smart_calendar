import { pool } from '../config/database';

export class FocusModeService {
  async activateFocusMode(userId: number, eventId: number, endTime: Date) {
    const blockedApps = ['slack', 'discord', 'telegram'];
    const blockedWebsites = ['youtube.com', 'facebook.com', 'twitter.com', 'instagram.com'];

    await pool.query(
      `INSERT INTO focus_sessions (user_id, event_id, start_time, end_time, blocked_apps, blocked_websites, is_active)
       VALUES ($1, $2, NOW(), $3, $4, $5, true)`,
      [userId, eventId, endTime, JSON.stringify(blockedApps), JSON.stringify(blockedWebsites)]
    );

    return { blockedApps, blockedWebsites, endTime };
  }

  async deactivateFocusMode(userId: number) {
    await pool.query(
      `UPDATE focus_sessions SET is_active = false WHERE user_id = $1 AND is_active = true`,
      [userId]
    );
  }

  async getActiveFocusSession(userId: number) {
    const { rows } = await pool.query(
      `SELECT * FROM focus_sessions WHERE user_id = $1 AND is_active = true LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  }
}
