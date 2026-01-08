import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { TimeAnalytics, TimeBreakdown } from '../../core/models/visualization/time-analytics.model';

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
    CommonModule,
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
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  analytics: TimeAnalytics | null = null;
  loading = false;
  selectedPeriod: 'week' | 'month' | 'year' | 'custom' = 'week';
  customStartDate: Date | null = null;
  customEndDate: Date | null = null;

  timeBreakdownChart: ChartData | null = null;
  productivityTrendChart: ChartData | null = null;
  weeklyComparisonChart: ChartData | null = null;

  constructor(private timeAnalyticsService: TimeAnalyticsService) {}

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
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
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
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
          backgroundColor: '#36A2EB'
        },
        {
          label: 'Horas em Reuniões',
          data: meetingHours,
          backgroundColor: '#FF6384'
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
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
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
      case 'up': return '#4CAF50';
      case 'down': return '#F44336';
      default: return '#9E9E9E';
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
