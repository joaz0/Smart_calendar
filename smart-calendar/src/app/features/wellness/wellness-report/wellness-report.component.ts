import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { WellnessService, WellnessMetrics, BreakPattern, WellnessRecommendation } from '../../../core/services/wellness/wellness.service';

@Component({
  standalone: true,
  selector: 'app-wellness-report',
  imports: [MatCardModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule, MatProgressBarModule],
  templateUrl: './wellness-report.html',
  styleUrl: './wellness-report.scss'
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
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  }

  getStressColor(level: string): string {
    switch (level) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      default: return '#9E9E9E';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  }
}
