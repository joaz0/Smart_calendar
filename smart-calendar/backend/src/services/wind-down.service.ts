import { pool } from '../config/database';

export class WindDownService {
  async enforceWindDownRules(userId: number) {
    const settings = await this.getWindDownSettings(userId);
    if (!settings?.is_active) return { violations: [], suggestions: [] };

    const sleepTime = this.getTodaySleepTime(settings.sleep_time);
    const windDownStart = new Date(sleepTime.getTime() - settings.wind_down_duration * 60000);
    
    const violatingEvents = await this.getEventsInWindDownPeriod(userId, windDownStart, sleepTime);
    const suggestions = violatingEvents.map(event => this.suggestReschedule(event, windDownStart));
    
    return { violations: violatingEvents, suggestions };
  }

  private async getWindDownSettings(userId: number) {
    const { rows } = await pool.query(
      `SELECT * FROM wind_down_settings WHERE user_id = $1`,
      [userId]
    );
    return rows[0];
  }

  private getTodaySleepTime(sleepTime: string): Date {
    const [hours, minutes] = sleepTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private async getEventsInWindDownPeriod(userId: number, start: Date, end: Date) {
    const { rows } = await pool.query(
      `SELECT * FROM events 
       WHERE user_id = $1 AND start_time BETWEEN $2 AND $3 AND is_protected_time = false`,
      [userId, start, end]
    );
    return rows;
  }

  private suggestReschedule(event: any, windDownStart: Date) {
    const newTime = new Date(windDownStart);
    newTime.setHours(newTime.getHours() - 2);
    return {
      eventId: event.id,
      currentTime: event.start_time,
      suggestedTime: newTime,
      reason: 'Conflito com horário de desacelerar'
    };
  }
}
