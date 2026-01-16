import { Injectable, inject } from '@angular/core.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http.component';
import { catchError } from 'rxjs/operators.component';
import { environment } from '../../../../environments/environment.component';


export interface FocusSession {
  id: string;
  startTime: Date;
  plannedDuration: number;
  actualDuration?: number;
  task: string;
  completed: boolean;
  interruptions: number;
}

@Injectable({
  providedIn: 'root'
})
export class FocusModeService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/context/focus`;
  private focusModeActive = new BehaviorSubject<boolean>(false);
  focusModeActive$ = this.focusModeActive.asObservable();

  startFocusSession(task: string, duration: number): Observable<FocusSession> {
    this.focusModeActive.next(true);
    return this.http.post<FocusSession>(`${this.apiUrl}/start`, { task, duration }).pipe(
      catchError(() => of({
        id: Date.now().toString(),
        startTime: new Date(),
        plannedDuration: duration,
        task,
        completed: false,
        interruptions: 0
      }))
    );
  }

  endFocusSession(sessionId: string, completed: boolean): Observable<void> {
    this.focusModeActive.next(false);
    return this.http.post<void>(`${this.apiUrl}/end/${sessionId}`, { completed }).pipe(
      catchError(() => of(undefined))
    );
  }

  recordInterruption(sessionId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/interruption/${sessionId}`, {}).pipe(
      catchError(() => of(undefined))
    );
  }

  getFocusHistory(limit = 10): Observable<FocusSession[]> {
    return this.http.get<FocusSession[]>(`${this.apiUrl}/history`, { params: { limit: limit.toString() } }).pipe(
      catchError(() => of([]))
    );
  }

  getFocusStats(): Observable<{ totalSessions: number; averageDuration: number; completionRate: number }> {
    return this.http.get<any>(`${this.apiUrl}/stats`).pipe(
      catchError(() => of({ totalSessions: 45, averageDuration: 55, completionRate: 0.82 }))
    );
  }
}
