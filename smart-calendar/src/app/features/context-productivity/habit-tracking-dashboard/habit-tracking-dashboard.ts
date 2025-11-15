import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-habit-tracking-dashboard',
  imports: [],
  templateUrl: './habit-tracking-dashboard.html',
  styleUrl: './habit-tracking-dashboard.scss'
})
export class HabitTrackingDashboard {
  habits: any[] = [];

  openCreateDialog() {}

  getLast7Days() {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();
  }

  isCompleted(habitId: string, day: Date) {
    return false;
  }

  toggleDay(habitId: string, day: Date) {}

  getDayLabel(day: Date) {
    return day.toLocaleDateString('pt-BR', { weekday: 'short' });
  }

  viewStats(habitId: string) {}

  editHabit(habitId: string) {}

  deleteHabit(habitId: string) {}
}
