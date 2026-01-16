import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProductivityInsightsService, ProductivityMetricsData, ProductivityInsight, ProductivityPattern } from '../../../core/services/productivity/productivity-insights.service';

@Component({
  standalone: true,
  selector: 'app-productivity-insights',
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSelectModule
],
  templateUrl: './productivity-insights.html',
  styleUrl: './productivity-insights.scss'
})
export class ProductivityInsights implements OnInit, OnDestroy {
  private productivityService = inject(ProductivityInsightsService);

  private destroy$ = new Subject<void>();
  
  metricsData: ProductivityMetricsData | null = null;
  loading = false;
  selectedPeriod: 'week' | 'month' | 'quarter' = 'week';

  ngOnInit() {
    this.loadInsights();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInsights() {
    this.loading = true;
    const period = this.getPeriodDates();

    this.productivityService
      .getProductivityInsights(period.start, period.end)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.metricsData = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar insights:', err);
          this.loading = false;
        }
      });
  }

  getPeriodDates(): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();

    switch (this.selectedPeriod) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(end.getMonth() - 3);
        break;
    }

    return { start, end };
  }

  onPeriodChange() {
    this.loadInsights();
  }

  getScoreColor(score: number): string {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  }

  getImpactColor(impact: string): string {
    switch (impact) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  }

  getPatternIcon(type: string): string {
    switch (type) {
      case 'peak': return 'trending_up';
      case 'low': return 'trending_down';
      case 'consistent': return 'trending_flat';
      default: return 'timeline';
    }
  }

  getPatternColor(type: string): string {
    switch (type) {
      case 'peak': return '#4CAF50';
      case 'low': return '#F44336';
      case 'consistent': return '#2196F3';
      default: return '#9E9E9E';
    }
  }

  trackByInsight(index: number, insight: ProductivityInsight): string {
    return `${insight.category}-${index}`;
  }

  trackByPattern(index: number, pattern: ProductivityPattern): string {
    return `${pattern.type}-${pattern.timeRange}`;
  }
}
