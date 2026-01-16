import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface StressLevel {
  timestamp: Date;
  level: number;
  triggers: string[];
}

@Injectable({ providedIn: 'root' })
export class StressMonitorService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/wellness/stress`;

  constructor(private http: HttpClient) {}

  getCurrentLevel(): Observable<StressLevel> {
    return this.http.get<StressLevel>(`${this.apiUrl}/current`).pipe(
      catchError(() => of({
        timestamp: new Date(),
        level: 45,
        triggers: ['Reuniões consecutivas', 'Prazo apertado']
      }))
    );
  }

  logStressLevel(level: number, triggers?: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/log`, { level, triggers, timestamp: new Date() }).pipe(
      catchError(() => of(undefined))
    );
  }

  getHistory(days = 7): Observable<StressLevel[]> {
    return this.http.get<StressLevel[]>(`${this.apiUrl}/history`, { params: { days: days.toString() } }).pipe(
      catchError(() => of([]))
    );
  }

  getCopingStrategies(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/strategies`).pipe(
      catchError(() => of([
        'Respiração profunda por 5 minutos',
        'Caminhada de 10 minutos',
        'Conversar com colega'
      ]))
    );
  }
}
