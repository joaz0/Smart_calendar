import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface BurnoutRisk {
  level: 'low' | 'moderate' | 'high' | 'critical';
  score: number;
  factors: string[];
  recommendations: string[];
}

@Injectable({ providedIn: 'root' })
export class BurnoutDetectorService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/wellness/burnout`;

  constructor(private http: HttpClient) {}

  assessRisk(): Observable<BurnoutRisk> {
    return this.http.get<BurnoutRisk>(`${this.apiUrl}/assess`).pipe(
      catchError(() => of({
        level: 'moderate',
        score: 55,
        factors: [
          'Trabalho >50h/semana',
          'Poucas pausas',
          'Reuniões excessivas'
        ],
        recommendations: [
          'Reduza carga de trabalho gradualmente',
          'Agende dias de descanso',
          'Delegue tarefas quando possível'
        ]
      }))
    );
  }

  getEarlyWarnings(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/warnings`).pipe(
      catchError(() => of([
        'Você trabalhou >10h em 3 dos últimos 5 dias',
        'Zero dias de folga nas últimas 2 semanas'
      ]))
    );
  }

  schedulePrevention(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/prevention`, {}).pipe(
      catchError(() => of(undefined))
    );
  }
}
