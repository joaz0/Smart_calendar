import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface ContextSwitch {
  id: string;
  fromContext: string;
  toContext: string;
  timestamp: Date;
  switchCost: number;
}

export interface ContextSwitchAnalytics {
  totalSwitches: number;
  averageSwitchCost: number;
  mostFrequentSwitch: { from: string; to: string; count: number };
  recommendations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ContextSwitchingService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/context/switching`;

  recordSwitch(fromContext: string, toContext: string): Observable<ContextSwitch> {
    return this.http.post<ContextSwitch>(`${this.apiUrl}/record`, {
      fromContext,
      toContext,
      timestamp: new Date()
    }).pipe(
      catchError(() => of({
        id: Date.now().toString(),
        fromContext,
        toContext,
        timestamp: new Date(),
        switchCost: 15
      }))
    );
  }

  getAnalytics(period: { start: Date; end: Date }): Observable<ContextSwitchAnalytics> {
    return this.http.post<ContextSwitchAnalytics>(`${this.apiUrl}/analytics`, period).pipe(
      catchError(() => of({
        totalSwitches: 45,
        averageSwitchCost: 12,
        mostFrequentSwitch: { from: 'trabalho', to: 'reunião', count: 15 },
        recommendations: ['Agrupe reuniões em blocos', 'Evite interrupções em períodos de foco']
      }))
    );
  }

  getSwitchHistory(limit = 20): Observable<ContextSwitch[]> {
    return this.http.get<ContextSwitch[]>(`${this.apiUrl}/history`, { params: { limit: limit.toString() } }).pipe(
      catchError(() => of([]))
    );
  }
}
