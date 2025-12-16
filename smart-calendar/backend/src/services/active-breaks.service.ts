import { query } from '../config/database';

interface BreakSlot {
  start: Date;
  end: Date;
  type: string;
}

export class ActiveBreaksService {
  async scheduleSmartBreaks(userId: number, day: Date) {
    const events = await this.getDayEvents(userId, day);
    const preferences = await this.getBreakPreferences(userId);
    const breakPattern = this.calculateOptimalBreakPattern(events, preferences);
    
    const createdBreaks = await Promise.all(
      breakPattern.map(breakSlot => this.createBreakEvent(userId, breakSlot))
    );

    return createdBreaks;
  }

  private async getDayEvents(userId: number, day: Date) {
    const { rows } = await query(
      `SELECT * FROM events 
       WHERE user_id = $1 AND DATE(start_time) = $2 AND is_break = false
       ORDER BY start_time`,
      [userId, day]
    );
    return rows;
  }

  private async getBreakPreferences(userId: number) {
    const { rows } = await query(
      `SELECT * FROM break_preferences WHERE user_id = $1`,
      [userId]
    );
    return rows[0] || { break_interval: 90, break_duration: 15 };
  }

  private calculateOptimalBreakPattern(events: any[], preferences: any): BreakSlot[] {
    const breaks: BreakSlot[] = [];
    let lastBreakEnd = events[0]?.start_time || new Date();
    
    events.forEach(event => {
      const workDuration = (event.start_time.getTime() - lastBreakEnd.getTime()) / 60000;
      
      if (workDuration > preferences.break_interval) {
        const breakTime = new Date(lastBreakEnd.getTime() + preferences.break_interval * 60000);
        breaks.push({
          start: breakTime,
          end: new Date(breakTime.getTime() + preferences.break_duration * 60000),
          type: 'active_break'
        });
        lastBreakEnd = breakTime;
      }
      
      lastBreakEnd = event.end_time;
    });
    
    return breaks;
  }

  private async createBreakEvent(userId: number, breakSlot: BreakSlot) {
    const { rows } = await query(
      `INSERT INTO events (title, start_time, end_time, user_id, is_break, break_type, color)
       VALUES ($1, $2, $3, $4, true, $5, '#4CAF50') RETURNING *`,
      ['💧 Pausa Ativa', breakSlot.start, breakSlot.end, userId, breakSlot.type]
    );
    return rows[0];
  }
}
