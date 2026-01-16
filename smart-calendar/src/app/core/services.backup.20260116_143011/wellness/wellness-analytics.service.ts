import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.component';

export interface WellnessScore {
  overall: number;
  physical: number;
  mental: number;
  workLifeBalance: number;
}

@Injectable({ providedIn: 'root' })
export class WellnessAnalyticsService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/wellness/analytics`;

  getScore(): Observable<WellnessScore> {
    return this.http.get<WellnessScore>(`${this.apiUrl}/score`).pipe(
      catchError(() => of({
        overall: 78,
        physical: 82,
        mental: 75,
        workLifeBalance: 77
      }))
    );
  }

  getTrends(days = 30): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trends`, { params: { days: days.toString() } }).pipe(
      catchError(() => of([]))
    );
  }

  getRecommendations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/recommendations`).pipe(
      catchError(() => of([
        'Aumente tempo de exercício em 15 minutos/dia',
        'Mantenha horário de sono consistente'
      ]))
    );
  }
}
