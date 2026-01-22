import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  availability: 'available' | 'busy' | 'away';
}

@Injectable({ providedIn: 'root' })
export class TeamCalendarService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/collaboration/team`;

  getTeamAvailability(teamId: string, date: Date): Observable<TeamMember[]> {
    return this.http.post<TeamMember[]>(`${this.apiUrl}/availability`, { teamId, date }).pipe(
      catchError(() => of([
        { id: '1', name: 'João Silva', email: 'joao@example.com', availability: 'available' }
      ]))
    );
  }

  findCommonSlots(memberIds: string[], duration: number): Observable<Date[]> {
    return this.http.post<Date[]>(`${this.apiUrl}/common-slots`, { memberIds, duration }).pipe(
      catchError(() => of([new Date()]))
    );
  }
}
