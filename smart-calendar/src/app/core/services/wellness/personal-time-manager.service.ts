import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


export interface PersonalTimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  days: string[];
  protected: boolean;
}

export interface PersonalTimeStats {
  protectedHours: number;
  blockedInterruptions: number;
}

@Injectable({ providedIn: 'root' })
export class PersonalTimeManagerService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/wellness/personal-time`;
  private isActiveSubject = new BehaviorSubject<boolean>(false);
  private statsSubject = new BehaviorSubject<PersonalTimeStats>({
    protectedHours: 0,
    blockedInterruptions: 0
  });

  isActive$ = this.isActiveSubject.asObservable();
  stats$ = this.statsSubject.asObservable();

  enableProtection(): Observable<boolean> {
    return this.http.post<{ active?: boolean; stats?: PersonalTimeStats }>(`${this.apiUrl}/enable`, {}).pipe(
      tap((res) => {
        this.isActiveSubject.next(res.active ?? true);
        if (res.stats) {
          this.statsSubject.next({ ...this.statsSubject.value, ...res.stats });
        }
      }),
      map((res) => res.active ?? true),
      catchError(() => {
        this.isActiveSubject.next(true);
        return of(true);
      })
    );
  }

  disableProtection(): Observable<boolean> {
    return this.http.post<{ active?: boolean }>(`${this.apiUrl}/disable`, {}).pipe(
      tap((res) => this.isActiveSubject.next(res.active ?? false)),
      map((res) => res.active ?? false),
      catchError(() => {
        this.isActiveSubject.next(false);
        return of(false);
      })
    );
  }

  getProtectedBlocks(): Observable<PersonalTimeBlock[]> {
    return this.http.get<PersonalTimeBlock[]>(this.apiUrl).pipe(
      catchError(() => of([
        {
          id: '1',
          startTime: '18:00',
          endTime: '22:00',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          protected: true
        }
      ]))
    );
  }

  createBlock(block: Omit<PersonalTimeBlock, 'id'>): Observable<PersonalTimeBlock> {
    return this.http.post<PersonalTimeBlock>(this.apiUrl, block).pipe(
      catchError(() => of({ ...block, id: Date.now().toString() } as PersonalTimeBlock))
    );
  }

  deleteBlock(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }

  checkViolations(): Observable<{ count: number; details: string[] }> {
    return this.http.get<any>(`${this.apiUrl}/violations`).pipe(
      catchError(() => of({ count: 0, details: [] }))
    );
  }

  refreshStats(): Observable<PersonalTimeStats> {
    return this.http.get<PersonalTimeStats>(`${this.apiUrl}/stats`).pipe(
      tap((stats) => this.statsSubject.next(stats)),
      catchError(() => {
        const fallback = this.statsSubject.value;
        return of(fallback);
      })
    );
  }
}
