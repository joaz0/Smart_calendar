import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface CollaborationMetrics {
  totalMeetings: number;
  averageMeetingDuration: number;
  topCollaborators: { name: string; count: number }[];
  meetingEfficiency: number;
}

@Injectable({ providedIn: 'root' })
export class CollaborationAnalyticsService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/collaboration/analytics`;

  getMetrics(period: { start: Date; end: Date }): Observable<CollaborationMetrics> {
    return this.http.post<CollaborationMetrics>(this.apiUrl, period).pipe(
      catchError(() => of({
        totalMeetings: 24,
        averageMeetingDuration: 45,
        topCollaborators: [{ name: 'João Silva', count: 12 }],
        meetingEfficiency: 0.78
      }))
    );
  }

  getCollaborationNetwork(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/network`).pipe(
      catchError(() => of({ nodes: [], edges: [] }))
    );
  }
}
