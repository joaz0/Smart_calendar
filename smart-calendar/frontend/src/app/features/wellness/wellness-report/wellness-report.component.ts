import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { WellnessService, WellnessMetrics, BreakPattern, WellnessRecommendation } from '../../../core/services/wellness/wellness.service';
import { STATUS_COLOR_VARS } from '../../../shared/tokens/color-tokens';

@Component({
  standalone: true,
  selector: 'app-wellness-report',
  imports: [MatCardModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule, MatProgressBarModule],
  templateUrl: './wellness-report.component.html',
  styleUrl: './wellness-report.component.scss'
})
export class WellnessReportComponent implements OnInit, OnDestroy {
  private wellnessService = inject(WellnessService);

  private destroy$ = new Subject<void>();
  
  metrics: WellnessMetrics | null = null;
  breakPatterns: BreakPattern[] = [];
  recommendations: WellnessRecommendation[] = [];
  loading = false;

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.loading = true;
    forkJoin({
      metrics: this.wellnessService.getWellnessMetrics(),
      patterns: this.wellnessService.getBreakPatterns(),
      recommendations: this.wellnessService.getRecommendations()
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.metrics = data.metrics;
        this.breakPatterns = data.patterns;
        this.recommendations = data.recommendations;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getScoreColor(score: number): string {
    if (score >= 80) return STATUS_COLOR_VARS.success;
    if (score >= 60) return STATUS_COLOR_VARS.warning;
    return STATUS_COLOR_VARS.error;
  }

  getStressColor(level: string): string {
    switch (level) {
      case 'low': return STATUS_COLOR_VARS.success;
      case 'medium': return STATUS_COLOR_VARS.warning;
      case 'high': return STATUS_COLOR_VARS.error;
      default: return STATUS_COLOR_VARS.neutral;
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return STATUS_COLOR_VARS.error;
      case 'medium': return STATUS_COLOR_VARS.warning;
      case 'low': return STATUS_COLOR_VARS.success;
      default: return STATUS_COLOR_VARS.neutral;
    }
  }

  get burnoutRisk(): number {
    if (!this.metrics) return 0;
    const stressScore = this.metrics.stressLevel === 'high' ? 85 : this.metrics.stressLevel === 'medium' ? 60 : 30;
    const overworkScore = Math.min(this.metrics.overworkHours * 10, 100);
    const recoveryPenalty = Math.max(0, 80 - this.metrics.sleepQuality);
    return Math.min(100, Math.round((stressScore + overworkScore + recoveryPenalty) / 3));
  }

  get recoveryScore(): number {
    if (!this.metrics) return 0;
    return Math.round((this.metrics.breakFrequency + this.metrics.sleepQuality) / 2);
  }

  get onTargetBreakDays(): number {
    return this.breakPatterns.filter(pattern => pattern.breaksTaken >= pattern.recommended).length;
  }

  get breakDeficit(): number {
    return this.breakPatterns.reduce((acc, pattern) => acc + Math.max(0, pattern.recommended - pattern.breaksTaken), 0);
  }
}
