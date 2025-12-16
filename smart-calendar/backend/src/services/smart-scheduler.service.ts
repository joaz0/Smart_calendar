import { query } from '../config/database';

interface TimeSlot {
  start: Date;
  end: Date;
  score: number;
}

export class SmartSchedulerService {
  async suggestOptimalTime(userId: number, taskType: string, duration: number): Promise<TimeSlot[]> {
    const productivityPattern = await this.getProductivityPattern(userId);
    const energyMap = this.getEnergyMap();
    const availableSlots = await this.getAvailableSlots(userId, duration);

    return availableSlots.map(slot => ({
      ...slot,
      score: this.calculateSlotScore(slot, productivityPattern, energyMap, taskType)
    })).sort((a, b) => b.score - a.score);
  }

  private async getProductivityPattern(userId: number) {
    const { rows } = await query(
      `SELECT 
        EXTRACT(HOUR FROM start_time) as hour,
        COUNT(*) as total_tasks,
        AVG(CASE WHEN is_completed THEN 1 ELSE 0 END) as success_rate
      FROM tasks 
      WHERE user_id = $1 
      GROUP BY EXTRACT(HOUR FROM start_time)
      ORDER BY success_rate DESC`,
      [userId]
    );
    return rows;
  }

  private getEnergyMap() {
    return {
      'morning': { 'creative': 0.8, 'analytical': 0.9, 'routine': 0.7 },
      'afternoon': { 'creative': 0.6, 'analytical': 0.8, 'routine': 0.9 },
      'evening': { 'creative': 0.7, 'analytical': 0.5, 'routine': 0.6 }
    };
  }

  private async getAvailableSlots(userId: number, duration: number): Promise<TimeSlot[]> {
    const { rows } = await query(
      `SELECT start_time, end_time FROM events 
       WHERE user_id = $1 AND start_time >= NOW()
       ORDER BY start_time`,
      [userId]
    );

    const slots: TimeSlot[] = [];
    const workStart = new Date();
    workStart.setHours(9, 0, 0, 0);
    
    for (let i = 0; i < rows.length - 1; i++) {
      const gap = rows[i + 1].start_time.getTime() - rows[i].end_time.getTime();
      if (gap >= duration * 60000) {
        slots.push({
          start: rows[i].end_time,
          end: rows[i + 1].start_time,
          score: 0
        });
      }
    }
    return slots;
  }

  private calculateSlotScore(slot: TimeSlot, productivity: any[], energyMap: any, taskType: string): number {
    let score = 0;
    const hour = slot.start.getHours();

    if (hour >= 9 && hour <= 11) score += 2;
    if (hour >= 14 && hour <= 16) score += 1;
    if (hour >= 12 && hour <= 13) score -= 3;

    return score;
  }

  async findOptimalMeetingTime(participantIds: number[], duration: number): Promise<TimeSlot | null> {
    const availabilities = await Promise.all(
      participantIds.map(id => this.getUserAvailability(id))
    );

    const commonSlots = this.findCommonSlots(availabilities, duration);
    return commonSlots.length > 0 ? commonSlots[0] : null;
  }

  private async getUserAvailability(userId: number) {
    const { rows } = await query(
      `SELECT * FROM user_availability WHERE user_id = $1 AND is_available = true`,
      [userId]
    );
    return rows;
  }

  private findCommonSlots(availabilities: any[][], duration: number): TimeSlot[] {
    return [];
  }
}
