import { Component, OnInit, OnDestroy } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { HabitTrackerService } from '../../../core/services/context/habit-tracker.service';
import { Habit, HabitStats } from '../../../core/models/context/habit.model';

@Component({
  standalone: true,
  selector: 'app-habit-tracking-dashboard',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule
],
  templateUrl: './habit-tracking-dashboard.html',
  styleUrl: './habit-tracking-dashboard.scss'
})
export class HabitTrackingDashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  habits: Habit[] = [];
  habitStats = new Map<string, HabitStats>();
  loading = false;
  selectedPeriod: 'week' | 'month' | 'all' = 'week';

  constructor(private habitService: HabitTrackerService) {}

  ngOnInit() {
    this.loadHabits();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadHabits() {
    this.loading = true;
    this.habitService.getHabits()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (habits) => {
          this.habits = habits;
          this.loadStats();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  loadStats() {
    this.habits.forEach(habit => {
      this.habitService.getHabitStats(habit.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(stats => {
          this.habitStats.set(habit.id, stats);
        });
    });
  }

  openCreateDialog() {
    console.log('Open create dialog - to be implemented');
  }

  getLast7Days(): Date[] {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }

  isCompleted(habit: Habit, day: Date): boolean {
    const dateStr = day.toDateString();
    return habit.completions.some(
      c => new Date(c.date).toDateString() === dateStr && c.completed
    );
  }

  toggleDay(habit: Habit, day: Date) {
    this.habitService.toggleCompletion(habit.id, day)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  getDayLabel(day: Date): string {
    return day.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();
  }

  getDayNumber(day: Date): number {
    return day.getDate();
  }

  viewStats(habitId: string) {
    console.log('View stats for habit:', habitId);
  }

  editHabit(habitId: string) {
    console.log('Edit habit:', habitId);
  }

  deleteHabit(habitId: string) {
    if (confirm('Tem certeza que deseja excluir este hábito?')) {
      this.habitService.deleteHabit(habitId)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  getStats(habitId: string): HabitStats | null {
    return this.habitStats.get(habitId) || null;
  }

  getStreakIcon(streak: number): string {
    if (streak >= 30) return 'whatshot';
    if (streak >= 7) return 'local_fire_department';
    return 'fire_extinguisher';
  }

  getStreakColor(streak: number): string {
    if (streak >= 30) return '#FF6B00';
    if (streak >= 7) return '#FF9800';
    return '#FFC107';
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      health: 'favorite',
      productivity: 'trending_up',
      learning: 'school',
      personal: 'person',
      other: 'label'
    };
    return icons[category] || 'label';
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  getTotalCompletions(): number {
    return this.habits.reduce((total, habit) => {
      return total + habit.completions.filter(c => c.completed).length;
    }, 0);
  }

  trackByHabitId(index: number, habit: Habit): string {
    return habit.id;
  }
}
