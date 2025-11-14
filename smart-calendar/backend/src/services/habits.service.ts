import { pool } from '../config/database';

interface HabitStats {
  consistencyRate: number;
  currentStreak: number;
  longestStreak: number;
  completedDays: number;
  totalDays: number;
}

export class HabitsService {
  async calculateConsistency(habitId: number, period: 'week' | 'month' | 'year'): Promise<HabitStats> {
    const entries = await this.getHabitEntries(habitId, period);
    const totalDays = this.getTotalDaysInPeriod(period);
    const completedDays = entries.filter(e => e.completed).length;
    
    return {
      consistencyRate: (completedDays / totalDays) * 100,
      currentStreak: this.calculateCurrentStreak(entries),
      longestStreak: this.calculateLongestStreak(entries),
      completedDays,
      totalDays
    };
  }

  private async getHabitEntries(habitId: number, period: string) {
    const { rows } = await pool.query(
      `SELECT * FROM habit_entries 
       WHERE habit_id = $1 AND entry_date >= NOW() - INTERVAL '1 ${period}'
       ORDER BY entry_date DESC`,
      [habitId]
    );
    return rows;
  }

  private getTotalDaysInPeriod(period: string): number {
    return period === 'week' ? 7 : period === 'month' ? 30 : 365;
  }

  private calculateCurrentStreak(entries: any[]): number {
    let streak = 0;
    for (const entry of entries) {
      if (entry.completed) streak++;
      else break;
    }
    return streak;
  }

  private calculateLongestStreak(entries: any[]): number {
    let longest = 0, current = 0;
    for (const entry of entries) {
      if (entry.completed) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }
    return longest;
  }
}
