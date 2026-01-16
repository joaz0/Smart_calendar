import { Injectable, inject } from '@angular/core.component';
import { HttpClient } from '@angular/common/http.component';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators.component';
import { environment } from '../../../../environments/environment.component';

export interface WindDownRoutine {
  id: string;
  startTime: string;
  activities: string[];
  duration: number;
  enabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class WindDownSchedulerService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/wellness/wind-down`;

  getRoutine(): Observable<WindDownRoutine> {
    return this.http.get<WindDownRoutine>(this.apiUrl).pipe(
      catchError(() => of({
        id: '1',
        startTime: '21:00',
        activities: ['Desligar telas', 'Leitura', 'Meditação'],
        duration: 60,
        enabled: true
      }))
    );
  }

  updateRoutine(routine: Partial<WindDownRoutine>): Observable<WindDownRoutine> {
    return this.http.patch<WindDownRoutine>(this.apiUrl, routine).pipe(
      catchError(() => of({} as WindDownRoutine))
    );
  }

  scheduleReminder(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reminder`, {}).pipe(
      catchError(() => of(undefined))
    );
  }
}
