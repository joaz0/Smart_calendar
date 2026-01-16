import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Calendar {
  id: string;
  name: string;
  description?: string;
  color: string;
  privacyLevel: 'public' | 'private' | 'confidential';
  owner: string;
  shared: boolean;
  sharedWith?: string[];
  permissions?: Record<string, 'view' | 'edit' | 'admin'>;
  defaultVisibility: boolean;
}

export interface CalendarGroup {
  id: string;
  name: string;
  calendars: string[];
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MultipleCalendarsService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/privacy/calendars`;

  constructor(private http: HttpClient) {}

  getAllCalendars(): Observable<Calendar[]> {
    return this.http.get<Calendar[]>(`${this.apiUrl}`).pipe(
      catchError(() => of(this.getMockCalendars()))
    );
  }

  getCalendar(calendarId: string): Observable<Calendar> {
    return this.http.get<Calendar>(`${this.apiUrl}/${calendarId}`).pipe(
      catchError(() => of(this.getMockCalendars()[0]))
    );
  }

  createCalendar(calendar: Omit<Calendar, 'id' | 'owner'>): Observable<Calendar> {
    return this.http.post<Calendar>(`${this.apiUrl}`, calendar).pipe(
      catchError(() => of({ ...calendar, id: `cal-${Date.now()}`, owner: 'currentUser' } as Calendar))
    );
  }

  updateCalendar(calendarId: string, updates: Partial<Calendar>): Observable<Calendar> {
    return this.http.patch<Calendar>(`${this.apiUrl}/${calendarId}`, updates).pipe(
      catchError(() => of(this.getMockCalendars()[0]))
    );
  }

  deleteCalendar(calendarId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${calendarId}`).pipe(
      catchError(() => of(undefined))
    );
  }

  shareCalendar(calendarId: string, userEmail: string, permission: 'view' | 'edit' | 'admin'): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${calendarId}/share`, { userEmail, permission }).pipe(
      catchError(() => of(undefined))
    );
  }

  unshareCalendar(calendarId: string, userEmail: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${calendarId}/share/${userEmail}`).pipe(
      catchError(() => of(undefined))
    );
  }

  updatePermissions(calendarId: string, userEmail: string, permission: 'view' | 'edit' | 'admin'): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${calendarId}/permissions`, { userEmail, permission }).pipe(
      catchError(() => of(undefined))
    );
  }

  getSharedCalendars(): Observable<Calendar[]> {
    return this.http.get<Calendar[]>(`${this.apiUrl}/shared`).pipe(
      catchError(() => of(this.getMockCalendars().filter(c => c.shared)))
    );
  }

  createGroup(name: string, description: string, calendarIds: string[]): Observable<CalendarGroup> {
    return this.http.post<CalendarGroup>(`${this.apiUrl}/groups`, { name, description, calendarIds }).pipe(
      catchError(() => of({
        id: `group-${Date.now()}`,
        name,
        description,
        calendars: calendarIds
      }))
    );
  }

  getGroups(): Observable<CalendarGroup[]> {
    return this.http.get<CalendarGroup[]>(`${this.apiUrl}/groups`).pipe(
      catchError(() => of(this.getMockGroups()))
    );
  }

  toggleCalendarVisibility(calendarId: string, visible: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${calendarId}/visibility`, { visible }).pipe(
      catchError(() => of(undefined))
    );
  }

  mergeCalendars(sourceCalendarIds: string[], targetCalendarId: string): Observable<{ merged: number }> {
    return this.http.post<any>(`${this.apiUrl}/merge`, { sourceCalendarIds, targetCalendarId }).pipe(
      catchError(() => of({ merged: 0 }))
    );
  }

  private getMockCalendars(): Calendar[] {
    return [
      {
        id: 'cal-1',
        name: 'Trabalho',
        description: 'Eventos e tarefas profissionais',
        color: '#3F51B5',
        privacyLevel: 'private',
        owner: 'currentUser',
        shared: false,
        defaultVisibility: true
      },
      {
        id: 'cal-2',
        name: 'Pessoal',
        description: 'Compromissos pessoais e familiares',
        color: '#4CAF50',
        privacyLevel: 'confidential',
        owner: 'currentUser',
        shared: false,
        defaultVisibility: true
      },
      {
        id: 'cal-3',
        name: 'Projetos',
        description: 'Marcos e entregas de projetos',
        color: '#FF9800',
        privacyLevel: 'public',
        owner: 'currentUser',
        shared: true,
        sharedWith: ['joao@example.com', 'maria@example.com'],
        permissions: {
          'joao@example.com': 'edit',
          'maria@example.com': 'view'
        },
        defaultVisibility: true
      },
      {
        id: 'cal-4',
        name: 'Feriados',
        description: 'Feriados nacionais e regionais',
        color: '#F44336',
        privacyLevel: 'public',
        owner: 'system',
        shared: true,
        defaultVisibility: true
      }
    ];
  }

  private getMockGroups(): CalendarGroup[] {
    return [
      {
        id: 'group-1',
        name: 'Profissional',
        description: 'Calendários relacionados ao trabalho',
        calendars: ['cal-1', 'cal-3']
      },
      {
        id: 'group-2',
        name: 'Vida Pessoal',
        description: 'Calendários pessoais',
        calendars: ['cal-2']
      }
    ];
  }
}
