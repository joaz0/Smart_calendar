import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface EventTemplate {
  id: string;
  name: string;
  description: string;
  defaultDuration: number;
  category: string;
  defaultLocation?: string;
  defaultAttendees?: string[];
  customFields?: { [key: string]: any };
}

@Injectable({
  providedIn: 'root'
})
export class EventTemplatesService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/context/templates`;

  constructor(private http: HttpClient) {}

  getAllTemplates(): Observable<EventTemplate[]> {
    return this.http.get<EventTemplate[]>(`${this.apiUrl}`).pipe(
      catchError(() => of([
        {
          id: '1',
          name: 'Reunião 1:1',
          description: 'Reunião individual com membros da equipe',
          defaultDuration: 30,
          category: 'Reunião',
          defaultLocation: 'Sala de reuniões 1'
        },
        {
          id: '2',
          name: 'Sprint Planning',
          description: 'Planejamento de sprint',
          defaultDuration: 120,
          category: 'Agile',
          defaultAttendees: ['equipe@example.com']
        }
      ]))
    );
  }

  createTemplate(template: Omit<EventTemplate, 'id'>): Observable<EventTemplate> {
    return this.http.post<EventTemplate>(`${this.apiUrl}`, template).pipe(
      catchError(() => of({ ...template, id: Date.now().toString() } as EventTemplate))
    );
  }

  updateTemplate(id: string, updates: Partial<EventTemplate>): Observable<EventTemplate> {
    return this.http.patch<EventTemplate>(`${this.apiUrl}/${id}`, updates).pipe(
      catchError(() => of({} as EventTemplate))
    );
  }

  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }

  applyTemplate(templateId: string, overrides?: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${templateId}/apply`, overrides || {}).pipe(
      catchError(() => of({}))
    );
  }
}
