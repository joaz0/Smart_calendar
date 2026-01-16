import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.component';

export interface ProductivityMetrics {
  date: Date;
  score: number;
  tasksCompleted: number;
  focusTime: number;
  distractions: number;
  energyLevel: number;
}

export interface ProductivityTrend {
  metric: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  period: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductivityAnalyzerService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/context/productivity`;

  getMetrics(period: { start: Date; end: Date }): Observable<ProductivityMetrics[]> {
    return this.http.post<ProductivityMetrics[]>(`${this.apiUrl}/metrics`, period).pipe(
      catchError(() => of([
        {
          date: new Date(),
          score: 85,
          tasksCompleted: 8,
          focusTime: 240,
          distractions: 5,
          energyLevel: 80
        }
      ]))
    );
  }

  getTrends(days = 30): Observable<ProductivityTrend[]> {
    return this.http.get<ProductivityTrend[]>(`${this.apiUrl}/trends`, { params: { days: days.toString() } }).pipe(
      catchError(() => of([
        { metric: 'score', trend: 'up', changePercent: 15, period: 'last_week' },
        { metric: 'focus_time', trend: 'up', changePercent: 23, period: 'last_week' }
      ]))
    );
  }

  getRecommendations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/recommendations`).pipe(
      catchError(() => of([
        'Agende tarefas difíceis entre 9h-11h quando sua energia está alta',
        'Reduza reuniões nas quartas-feiras para aumentar tempo de foco'
      ]))
    );
  }
}
