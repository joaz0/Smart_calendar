import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, interval } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface BreakActivity {
  id: string;
  name: string;
  duration: number;
  category: 'stretch' | 'walk' | 'hydrate' | 'eyes';
}

@Injectable({ providedIn: 'root' })
export class ActiveBreaksService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/wellness/breaks`;

  constructor(private http: HttpClient) {}

  getBreakSuggestions(): Observable<BreakActivity[]> {
    return this.http.get<BreakActivity[]>(`${this.apiUrl}/suggestions`).pipe(
      catchError(() => of([
        { id: '1', name: 'Alongamento', duration: 5, category: 'stretch' },
        { id: '2', name: 'Caminhada curta', duration: 10, category: 'walk' }
      ]))
    );
  }

  scheduleBreak(activityId: string, time: Date): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/schedule`, { activityId, time }).pipe(
      catchError(() => of(undefined))
    );
  }

  logBreak(activityId: string, completed: boolean): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/log`, { activityId, completed, timestamp: new Date() }).pipe(
      catchError(() => of(undefined))
    );
  }

  getBreakStats(): Observable<{ total: number; completed: number }> {
    return this.http.get<any>(`${this.apiUrl}/stats`).pipe(
      catchError(() => of({ total: 20, completed: 16 }))
    );
  }
}
