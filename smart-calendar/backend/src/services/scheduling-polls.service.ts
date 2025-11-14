import { pool } from '../config/database';

export class SchedulingPollsService {
  async createPoll(organizerId: number, title: string, timeSlots: any[], durationMinutes: number) {
    const { rows } = await pool.query(
      `INSERT INTO scheduling_polls (organizer_id, title, time_slots, duration_minutes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [organizerId, title, JSON.stringify(timeSlots), durationMinutes]
    );
    return rows[0];
  }

  async vote(pollId: number, userId: number, preferredSlots: number[]) {
    const { rows } = await pool.query(
      `INSERT INTO poll_votes (poll_id, user_id, preferred_slots)
       VALUES ($1, $2, $3)
       ON CONFLICT (poll_id, user_id) DO UPDATE SET preferred_slots = $3
       RETURNING *`,
      [pollId, userId, JSON.stringify(preferredSlots)]
    );
    return rows[0];
  }

  async getResults(pollId: number) {
    const { rows } = await pool.query(
      `SELECT preferred_slots FROM poll_votes WHERE poll_id = $1`,
      [pollId]
    );

    const slotCounts: Record<number, number> = {};
    rows.forEach(vote => {
      const slots = JSON.parse(vote.preferred_slots);
      slots.forEach((slotId: number) => {
        slotCounts[slotId] = (slotCounts[slotId] || 0) + 1;
      });
    });

    return Object.entries(slotCounts)
      .map(([slotId, count]) => ({ slotId: parseInt(slotId), votes: count }))
      .sort((a, b) => b.votes - a.votes);
  }
}
