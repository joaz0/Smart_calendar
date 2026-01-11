import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, interval } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface UserAvailability {
  userId: string;
  status: 'available' | 'busy' | 'away' | 'offline';
  until?: Date;
}

@Injectable({ providedIn: 'root' })
export class RealTimeAvailabilityService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/collaboration/availability`;

  constructor(private http: HttpClient) {}

  getAvailability(userId: string): Observable<UserAvailability> {
    return this.http.get<UserAvailability>(`${this.apiUrl}/${userId}`).pipe(
      catchError(() => of({ userId, status: 'available' }))
    );
  }

  updateMyAvailability(status: 'available' | 'busy' | 'away', until?: Date): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/update`, { status, until }).pipe(
      catchError(() => of(undefined))
    );
  }

  subscribeToUpdates(userIds: string[]): Observable<UserAvailability[]> {
    return interval(30000).pipe(
      switchMap(() => this.http.post<UserAvailability[]>(`${this.apiUrl}/batch`, { userIds }).pipe(
        catchError(() => of([]))
      ))
    );
  }
}
