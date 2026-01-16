import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.component';

export interface EventTemplate {
  id: string;
  name: string;
  category: 'work' | 'personal' | 'health' | 'social' | 'education' | 'other';
  duration: number;
  description?: string;
  location?: string;
  reminders?: number[];
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
  color?: string;
  isDefault?: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EventTemplateService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/event-templates`;
  private templatesSubject = new BehaviorSubject<EventTemplate[]>([]);
  public templates$ = this.templatesSubject.asObservable();

  constructor() {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.http.get<EventTemplate[]>(this.apiUrl).pipe(
      catchError(() => of(this.getMockTemplates()))
    ).subscribe(templates => {
      this.templatesSubject.next(templates);
    });
  }

  getTemplates(category?: string): Observable<EventTemplate[]> {
    if (category) {
      return this.templates$.pipe(
        map(templates => templates.filter(t => t.category === category))
      );
    }
    return this.templates$;
  }

  getTemplate(id: string): Observable<EventTemplate | undefined> {
    return this.templates$.pipe(
      map(templates => templates.find(t => t.id === id))
    );
  }

  createTemplate(template: Omit<EventTemplate, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>): Observable<EventTemplate> {
    const newTemplate: EventTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return this.http.post<EventTemplate>(this.apiUrl, newTemplate).pipe(
      tap(savedTemplate => {
        const current = this.templatesSubject.value;
        this.templatesSubject.next([...current, savedTemplate]);
      }),
      catchError(() => {
        const current = this.templatesSubject.value;
        this.templatesSubject.next([...current, newTemplate]);
        return of(newTemplate);
      })
    );
  }

  updateTemplate(id: string, updates: Partial<EventTemplate>): Observable<EventTemplate> {
    const updated = { ...updates, updatedAt: new Date() };
    
    return this.http.put<EventTemplate>(`${this.apiUrl}/${id}`, updated).pipe(
      tap(updatedTemplate => {
        const current = this.templatesSubject.value;
        const index = current.findIndex(t => t.id === id);
        if (index !== -1) {
          current[index] = updatedTemplate;
          this.templatesSubject.next([...current]);
        }
      }),
      catchError(() => {
        const current = this.templatesSubject.value;
        const index = current.findIndex(t => t.id === id);
        if (index !== -1) {
          current[index] = { ...current[index], ...updated };
          this.templatesSubject.next([...current]);
          return of(current[index]);
        }
        return of({} as EventTemplate);
      })
    );
  }

  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.templatesSubject.value;
        this.templatesSubject.next(current.filter(t => t.id !== id));
      }),
      catchError(() => {
        const current = this.templatesSubject.value;
        this.templatesSubject.next(current.filter(t => t.id !== id));
        return of(undefined);
      })
    );
  }

  incrementUsage(id: string): void {
    const current = this.templatesSubject.value;
    const template = current.find(t => t.id === id);
    if (template) {
      template.usageCount++;
      this.http.put(`${this.apiUrl}/${id}/usage`, {}).subscribe();
    }
  }

  private getMockTemplates(): EventTemplate[] {
    return [
      {
        id: '1',
        name: 'Daily Standup',
        category: 'work',
        duration: 15,
        description: 'Reunião diária de alinhamento da equipe',
        reminders: [5],
        recurrence: { frequency: 'daily', interval: 1 },
        color: '#2196F3',
        isDefault: true,
        usageCount: 45,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Academia',
        category: 'health',
        duration: 60,
        description: 'Treino de musculação',
        location: 'Smart Fit',
        reminders: [30, 5],
        recurrence: { frequency: 'weekly', interval: 3 },
        color: '#4CAF50',
        usageCount: 38,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Code Review',
        category: 'work',
        duration: 30,
        description: 'Revisão de código do time',
        reminders: [15],
        color: '#FF9800',
        usageCount: 22,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'Meditação',
        category: 'health',
        duration: 20,
        description: 'Prática de mindfulness',
        reminders: [5],
        recurrence: { frequency: 'daily', interval: 1 },
        color: '#9C27B0',
        usageCount: 18,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: '5',
        name: 'Curso Online',
        category: 'education',
        duration: 90,
        description: 'Aula de desenvolvimento web',
        recurrence: { frequency: 'weekly', interval: 2 },
        color: '#3F51B5',
        usageCount: 12,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: '6',
        name: 'Jantar com Amigos',
        category: 'social',
        duration: 120,
        description: 'Encontro social',
        location: 'Restaurante',
        reminders: [60, 30],
        color: '#E91E63',
        usageCount: 8,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];
  }
}
