import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';
import { FocusModeService, FocusSession, FocusStats } from '../../../core/services/focus/focus-mode.service';

@Component({
  standalone: true,
  selector: 'app-focus-mode-manager',
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule
],
  templateUrl: './focus-mode-manager.html',
  styleUrl: './focus-mode-manager.scss'
})
export class FocusModeManager implements OnInit, OnDestroy {
  private focusModeService = inject(FocusModeService);

  private destroy$ = new Subject<void>();
  
  isActive = false;
  isPaused = false;
  durations = [15, 25, 45, 60, 90];
  selectedDuration = 25;
  blockApps = false;
  blockWebsites = false;
  blockNotifications = true;
  timeRemaining = '00:00';
  timeRemainingSeconds = 0;
  progressOffset = 0;
  blockedItems: string[] = [];
  currentSession: FocusSession | null = null;
  stats: FocusStats | null = null;
  recentSessions: FocusSession[] = [];
  loading = false;

  ngOnInit() {
    this.focusModeService.isActive$
      .pipe(takeUntil(this.destroy$))
      .subscribe(active => {
        this.isActive = active;
        if (!active) {
          this.isPaused = false;
        }
      });

    this.focusModeService.currentSession$
      .pipe(takeUntil(this.destroy$))
      .subscribe(session => {
        this.currentSession = session;
        if (session) {
          this.updateBlockedItems(session);
        }
      });

    this.focusModeService.timeRemaining$
      .pipe(takeUntil(this.destroy$))
      .subscribe(seconds => {
        this.timeRemainingSeconds = seconds;
        this.timeRemaining = this.focusModeService.formatTime(seconds);
        this.updateProgress(seconds);
      });

    this.focusModeService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => {
        this.selectedDuration = settings.defaultDuration;
        this.blockApps = settings.blockApps;
        this.blockWebsites = settings.blockWebsites;
        this.blockNotifications = settings.blockNotifications;
      });

    this.loadStats();
    this.loadRecentSessions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  activate() {
    this.loading = true;
    this.focusModeService.startFocusSession(this.selectedDuration, {
      blockApps: this.blockApps,
      blockWebsites: this.blockWebsites,
      blockNotifications: this.blockNotifications
    }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  deactivate() {
    this.focusModeService.endFocusSession()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadStats();
        this.loadRecentSessions();
      });
  }

  pause() {
    this.isPaused = true;
    this.focusModeService.pauseFocusSession();
  }

  resume() {
    this.isPaused = false;
    this.focusModeService.resumeFocusSession();
  }

  recordDistraction() {
    this.focusModeService.recordDistraction();
  }

  recordTaskCompleted() {
    this.focusModeService.recordTaskCompletion();
  }

  private updateBlockedItems(session: FocusSession) {
    this.blockedItems = [];
    if (session.blockedApps.length > 0) {
      this.blockedItems.push(`📱 ${session.blockedApps.length} Apps`);
    }
    if (session.blockedWebsites.length > 0) {
      this.blockedItems.push(`🌐 ${session.blockedWebsites.length} Sites`);
    }
    if (session.notificationsBlocked) {
      this.blockedItems.push('🔔 Notificações');
    }
  }

  private updateProgress(seconds: number) {
    if (this.currentSession) {
      const total = this.currentSession.plannedDuration * 60;
      const progress = 1 - (seconds / total);
      const circumference = 2 * Math.PI * 90;
      this.progressOffset = circumference * (1 - progress);
    }
  }

  private loadStats() {
    this.focusModeService.getStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.stats = stats;
      });
  }

  private loadRecentSessions() {
    this.focusModeService.getSessions(5)
      .pipe(takeUntil(this.destroy$))
      .subscribe(sessions => {
        this.recentSessions = sessions;
      });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getProgressPercentage(): number {
    if (!this.currentSession) return 0;
    const total = this.currentSession.plannedDuration * 60;
    return Math.round(((total - this.timeRemainingSeconds) / total) * 100);
  }
}
