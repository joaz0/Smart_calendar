import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TimeAnalyticsService } from '../../core/services/visualization/time-analytics.service';
import { TimeAnalytics } from '../../core/models/visualization/time-analytics.model';
import { CHART_COLORS, CHART_SERIES_COLORS, STATUS_COLOR_VARS } from '../../shared/tokens/color-tokens';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatProgressSpinnerModule
],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private timeAnalyticsService = inject(TimeAnalyticsService);

  private destroy$ = new Subject<void>();
  
  analytics: TimeAnalytics | null = null;
  loading = false;
  selectedPeriod: 'week' | 'month' | 'year' | 'custom' = 'week';
  customStartDate: Date | null = null;
  customEndDate: Date | null = null;

  timeBreakdownChart: ChartData | null = null;
  productivityTrendChart: ChartData | null = null;
  weeklyComparisonChart: ChartData | null = null;

  ngOnInit() {
    this.loadAnalytics();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAnalytics() {
    this.loading = true;
    const period = this.getPeriodDates();

    this.timeAnalyticsService
      .getTimeAnalytics(period.start, period.end)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.analytics = data;
          this.prepareCharts();
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar analytics:', err);
          this.loading = false;
        }
      });
  }

  getPeriodDates(): { start: Date; end: Date } {
    if (this.customStartDate && this.customEndDate) {
      return { start: this.customStartDate, end: this.customEndDate };
    }

    const end = new Date();
    const start = new Date();

    switch (this.selectedPeriod) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
    }

    return { start, end };
  }

  prepareCharts() {
    if (!this.analytics) return;

    this.prepareTimeBreakdownChart();
    this.prepareProductivityTrendChart();
    this.prepareWeeklyComparisonChart();
  }

  prepareTimeBreakdownChart() {
    if (!this.analytics?.breakdown) return;

    const breakdown = this.analytics.breakdown;
    this.timeBreakdownChart = {
      labels: ['Reuniões', 'Foco', 'Pausas', 'Pessoal', 'Outros'],
      datasets: [{
        label: 'Horas',
        data: [
          breakdown.meetings,
          breakdown.focusTime,
          breakdown.breaks,
          breakdown.personal,
          breakdown.other
        ],
        backgroundColor: [...CHART_SERIES_COLORS]
      }]
    };
  }

  prepareProductivityTrendChart() {
    if (!this.analytics) return;

    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const scores = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));

    this.productivityTrendChart = {
      labels: days,
      datasets: [{
        label: 'Score de Produtividade',
        data: scores,
        borderColor: CHART_COLORS.blue,
        backgroundColor: CHART_COLORS.blueFill,
        borderWidth: 2
      }]
    };
  }

  prepareWeeklyComparisonChart() {
    if (!this.analytics) return;

    const weeks = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
    const focusHours = Array.from({ length: 4 }, () => Math.floor(Math.random() * 40));
    const meetingHours = Array.from({ length: 4 }, () => Math.floor(Math.random() * 20));

    this.weeklyComparisonChart = {
      labels: weeks,
      datasets: [
        {
          label: 'Horas de Foco',
          data: focusHours,
          backgroundColor: CHART_COLORS.blue
        },
        {
          label: 'Horas em Reuniões',
          data: meetingHours,
          backgroundColor: CHART_COLORS.pink
        }
      ]
    };
  }

  onPeriodChange() {
    this.customStartDate = null;
    this.customEndDate = null;
    this.loadAnalytics();
  }

  onCustomDateChange() {
    if (this.customStartDate && this.customEndDate) {
      this.loadAnalytics();
    }
  }

  exportData() {
    if (!this.analytics) return;

    const dataStr = JSON.stringify(this.analytics, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analytics_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  getProductivityColor(score: number): string {
    if (score >= 80) return STATUS_COLOR_VARS.success;
    if (score >= 60) return STATUS_COLOR_VARS.warning;
    return STATUS_COLOR_VARS.error;
  }

  getTrendIcon(direction: 'up' | 'down' | 'stable'): string {
    switch (direction) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }

  getTrendColor(direction: 'up' | 'down' | 'stable'): string {
    switch (direction) {
      case 'up': return STATUS_COLOR_VARS.success;
      case 'down': return STATUS_COLOR_VARS.error;
      default: return STATUS_COLOR_VARS.neutral;
    }
  }

  formatHours(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h${m > 0 ? ` ${m}min` : ''}`;
  }

  getChartMax(values: number[]): number {
    return Math.ceil(Math.max(...values) * 1.2);
  }

  getChartPercentage(value: number, max: number): number {
    return (value / max) * 100;
  }
}
