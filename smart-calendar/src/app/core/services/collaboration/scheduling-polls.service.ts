import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface SchedulingPoll {
  id: string;
  title: string;
  proposedDates: Date[];
  votes: Record<string, string[]>;
  status: 'open' | 'closed';
}

@Injectable({ providedIn: 'root' })
export class SchedulingPollsService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/collaboration/polls`;

  constructor(private http: HttpClient) {}

  createPoll(poll: Omit<SchedulingPoll, 'id' | 'votes' | 'status'>): Observable<SchedulingPoll> {
    return this.http.post<SchedulingPoll>(this.apiUrl, poll).pipe(
      catchError(() => of({ ...poll, id: Date.now().toString(), votes: {}, status: 'open' } as SchedulingPoll))
    );
  }

  vote(pollId: string, date: Date, userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${pollId}/vote`, { date, userId }).pipe(
      catchError(() => of(undefined))
    );
  }

  getResults(pollId: string): Observable<SchedulingPoll> {
    return this.http.get<SchedulingPoll>(`${this.apiUrl}/${pollId}`).pipe(
      catchError(() => of({} as SchedulingPoll))
    );
  }
}
