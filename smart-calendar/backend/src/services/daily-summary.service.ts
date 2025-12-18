import { pool } from '../config/database';

export class DailySummaryService {
  async generateDailySummary(userId: number, date: Date) {
    const events = await this.getDayEvents(userId, date);
    const tasks = await this.getDayTasks(userId, date);
    const conflicts = await this.detectConflicts(events);

    const summary = this.buildSummary(events, tasks, conflicts);
    
    await pool.query(
      `INSERT INTO daily_summaries (user_id, summary_date, content, stats)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, summary_date) DO UPDATE SET content = $3, stats = $4`,
      [userId, date, summary, JSON.stringify({ events: events.length, tasks: tasks.length })]
    );

    return summary;
  }

  private async getDayEvents(userId: number, date: Date) {
    const { rows } = await pool.query(
      `SELECT * FROM events 
       WHERE user_id = $1 AND DATE(start_time) = $2
       ORDER BY start_time`,
      [userId, date]
    );
    return rows;
  }

  private async getDayTasks(userId: number, date: Date) {
    const { rows } = await pool.query(
      `SELECT * FROM tasks 
       WHERE user_id = $1 AND DATE(due_date) = $2
       ORDER BY priority DESC`,
      [userId, date]
    );
    return rows;
  }

  private async detectConflicts(events: any[]) {
    const conflicts: Array<{ event1: any; event2: any }> = [];
    for (let i = 0; i < events.length - 1; i++) {
      if (events[i].end_time > events[i + 1].start_time) {
        conflicts.push({ event1: events[i], event2: events[i + 1] });
      }
    }
    return conflicts;
  }

  private buildSummary(events: any[], tasks: any[], conflicts: any[]): string {
    let summary = `📅 Resumo do Dia\n\n`;
    summary += `Você tem ${events.length} compromissos e ${tasks.length} tarefas.\n\n`;

    if (events.length > 0) {
      summary += `📌 Compromissos:\n`;
      events.forEach(e => {
        const time = new Date(e.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        summary += `• ${time} - ${e.title}${e.location ? ` (${e.location})` : ''}\n`;
      });
      summary += `\n`;
    }

    if (tasks.length > 0) {
      summary += `✅ Tarefas:\n`;
      tasks.forEach(t => {
        summary += `• ${t.title} - Prioridade: ${t.priority}\n`;
      });
      summary += `\n`;
    }

    if (conflicts.length > 0) {
      summary += `⚠️ Atenção: ${conflicts.length} conflito(s) de horário detectado(s)!\n`;
    }

    return summary;
  }
}
