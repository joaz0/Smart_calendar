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
import { STATUS_COLOR_VARS } from '../../../shared/tokens/color-tokens';

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
  templateUrl: './productivity-insights.component.html',
  styleUrl: './productivity-insights.component.scss'
})
export class ProductivityInsightsComponent implements OnInit, OnDestroy {
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
    if (score >= 80) return STATUS_COLOR_VARS.success;
    if (score >= 60) return STATUS_COLOR_VARS.warning;
    return STATUS_COLOR_VARS.error;
  }

  getImpactColor(impact: string): string {
    switch (impact) {
      case 'high': return STATUS_COLOR_VARS.error;
      case 'medium': return STATUS_COLOR_VARS.warning;
      case 'low': return STATUS_COLOR_VARS.success;
      default: return STATUS_COLOR_VARS.neutral;
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
      case 'peak': return STATUS_COLOR_VARS.success;
      case 'low': return STATUS_COLOR_VARS.error;
      case 'consistent': return STATUS_COLOR_VARS.info;
      default: return STATUS_COLOR_VARS.neutral;
    }
  }

  trackByInsight(index: number, insight: ProductivityInsight): string {
    return `${insight.category}-${index}`;
  }

  trackByPattern(index: number, pattern: ProductivityPattern): string {
    return `${pattern.type}-${pattern.timeRange}`;
  }
}
