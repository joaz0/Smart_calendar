import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PomodoroService, PomodoroSession, PomodoroStats, PomodoroSettings } from '../../../core/services/pomodoro/pomodoro.service';

@Component({
  standalone: true,
  selector: 'app-pomodoro-timer',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatDividerModule
  ],
  templateUrl: './pomodoro-timer.html',
  styleUrl: './pomodoro-timer.scss'
})
export class PomodoroTimer implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isActive = false;
  currentSession: PomodoroSession | null = null;
  timeRemaining = '25:00';
  timeRemainingSeconds = 0;
  sessionsCompleted = 0;
  stats: PomodoroStats | null = null;
  recentSessions: PomodoroSession[] = [];
  settings: PomodoroSettings | null = null;
  progressOffset = 0;
  taskTitle = '';
  loading = false;

  constructor(private pomodoroService: PomodoroService) {}

  ngOnInit() {
    this.pomodoroService.isActive$
      .pipe(takeUntil(this.destroy$))
      .subscribe(active => this.isActive = active);

    this.pomodoroService.currentSession$
      .pipe(takeUntil(this.destroy$))
      .subscribe(session => this.currentSession = session);

    this.pomodoroService.timeRemaining$
      .pipe(takeUntil(this.destroy$))
      .subscribe(seconds => {
        this.timeRemainingSeconds = seconds;
        this.timeRemaining = this.pomodoroService.formatTime(seconds);
        this.updateProgress(seconds);
      });

    this.pomodoroService.sessionsCompleted$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => this.sessionsCompleted = count);

    this.pomodoroService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => this.settings = settings);

    this.loadStats();
    this.loadRecentSessions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startWork() {
    this.loading = true;
    this.pomodoroService.startWorkSession(undefined, this.taskTitle || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.taskTitle = '';
        },
        error: () => this.loading = false
      });
  }

  startBreak() {
    this.loading = true;
    this.pomodoroService.startBreak()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loading = false,
        error: () => this.loading = false
      });
  }

  complete() {
    this.pomodoroService.completeSession()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadStats();
        this.loadRecentSessions();
      });
  }

  interrupt() {
    this.pomodoroService.interruptSession()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadStats();
        this.loadRecentSessions();
      });
  }

  reset() {
    this.pomodoroService.resetSessionCount();
  }

  private updateProgress(seconds: number) {
    if (this.currentSession && this.settings) {
      const total = this.currentSession.duration * 60;
      const progress = 1 - (seconds / total);
      const circumference = 2 * Math.PI * 110;
      this.progressOffset = circumference * (1 - progress);
    }
  }

  private loadStats() {
    this.pomodoroService.getStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => this.stats = stats);
  }

  private loadRecentSessions() {
    this.pomodoroService.getSessions(10)
      .pipe(takeUntil(this.destroy$))
      .subscribe(sessions => this.recentSessions = sessions);
  }

  getSessionTypeLabel(type: string): string {
    switch (type) {
      case 'work': return 'Trabalho';
      case 'shortBreak': return 'Pausa Curta';
      case 'longBreak': return 'Pausa Longa';
      default: return type;
    }
  }

  getSessionTypeColor(type: string): string {
    switch (type) {
      case 'work': return '#E91E63';
      case 'shortBreak': return '#4CAF50';
      case 'longBreak': return '#2196F3';
      default: return '#9E9E9E';
    }
  }

  getProgressPercentage(): number {
    if (!this.currentSession) return 0;
    const total = this.currentSession.duration * 60;
    return Math.round(((total - this.timeRemainingSeconds) / total) * 100);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  updateAutoSettings() {
    if (this.settings) {
      this.pomodoroService.updateSettings(this.settings).subscribe();
    }
  }

  getTotalHours(minutes: number): number {
    return Math.floor(minutes / 60);
  }
}
