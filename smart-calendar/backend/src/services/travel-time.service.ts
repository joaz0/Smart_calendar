import { pool } from '../config/database';

export class TravelTimeService {
  async addTravelTime(eventId: number, userId: number) {
    const { rows } = await pool.query(
      `SELECT * FROM events WHERE id = $1`,
      [eventId]
    );
    const event = rows[0];

    if (!event.location) return null;

    const previousEvent = await this.getPreviousEvent(userId, event.start_time);
    const fromLocation = previousEvent?.location || 'home';
    
    const travelMinutes = await this.calculateTravelTime(fromLocation, event.location);
    
    const travelStart = new Date(event.start_time);
    travelStart.setMinutes(travelStart.getMinutes() - travelMinutes);

    const { rows: travelRows } = await pool.query(
      `INSERT INTO events (title, start_time, end_time, user_id, is_travel_time, parent_event_id, color)
       VALUES ($1, $2, $3, $4, true, $5, '#9E9E9E')
       RETURNING *`,
      [
        `🚗 Deslocamento: ${fromLocation} → ${event.location}`,
        travelStart,
        event.start_time,
        userId,
        eventId
      ]
    );

    return travelRows[0];
  }

  private async getPreviousEvent(userId: number, beforeTime: Date) {
    const { rows } = await pool.query(
      `SELECT * FROM events 
       WHERE user_id = $1 AND end_time < $2 AND is_travel_time = false
       ORDER BY end_time DESC LIMIT 1`,
      [userId, beforeTime]
    );
    return rows[0] || null;
  }

  private async calculateTravelTime(from: string, to: string): Promise<number> {
    return 30;
  }
}
