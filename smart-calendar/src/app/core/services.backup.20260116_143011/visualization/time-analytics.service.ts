import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.component';

export interface TimeAnalytics {
  totalHours: number;
  breakdown: TimeBreakdown;
  productivity: ProductivityMetrics;
  trends: TrendData[];
  insights: string[];
}

export interface TimeBreakdown {
  meetings: number;
  focusTime: number;
  breaks: number;
  personal: number;
  other: number;
}

export interface ProductivityMetrics {
  score: number;
  focusHours: number;
  completedTasks: number;
  efficiency: number;
  distractions: number;
}

export interface TrendData {
  category: string;
  change: number;
  direction: 'up' | 'down' | 'stable';
}

@Injectable({
  providedIn: 'root'
})
export class TimeAnalyticsService {
  private http = inject(HttpClient);


  getTimeAnalytics(startDate: Date, endDate: Date): Observable<TimeAnalytics> {
    return this.http.get<TimeAnalytics>(`${environment.apiUrl}/analytics/time`, {
      params: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    });
  }

  getProductivityTrends(period: 'week' | 'month' | 'year'): Observable<TrendData[]> {
    return this.http.get<TrendData[]>(`${environment.apiUrl}/analytics/trends/${period}`);
  }

  exportAnalytics(startDate: Date, endDate: Date, format: 'json' | 'csv'): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/analytics/export`, {
      params: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        format
      },
      responseType: 'blob'
    });
  }
}
