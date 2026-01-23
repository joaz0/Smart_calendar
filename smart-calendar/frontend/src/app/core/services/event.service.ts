import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { EntityService } from './entity.service';
import { CalendarEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService extends EntityService<CalendarEvent> {
  events$ = this.entities$;

  constructor() {
    super(inject(ApiService), '/events');
    this.loadEvents();
  }

  private buildRangeParams(startDate: Date, endDate: Date, page = 1, limit = 50): Record<string, string> {
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      page: page.toString(),
      limit: limit.toString(),
    };
  }

  private handleRangeError(message: string, error: unknown): Observable<CalendarEvent[]> {
    this.logger.error(message, error as Record<string, unknown>);
    this.setError(error);
    return of([]);
  }

  private loadEvents(): void {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 2);

    this.getEventsByDateRange(startDate, endDate).subscribe({
      next: (events) => {
        this.logger.info('Eventos carregados com sucesso', { count: events.length });
        this.entitiesSubject$.next(events);
      },
      error: (error) => {
        this.logger.error('Erro ao carregar eventos', error as Record<string, unknown>);
        this.setError(error);
      },
    });
  }

  getEventsByDateRange(startDate: Date, endDate: Date, page = 1, limit = 50): Observable<CalendarEvent[]> {
    const params = this.buildRangeParams(startDate, endDate, page, limit);

    return this.apiService.get<CalendarEvent[]>(this.apiEndpoint, { params }).pipe(
      map((response) => response.data || []),
      catchError((error) => this.handleRangeError('Erro ao buscar eventos por intervalo de datas', error))
    );
  }

  getAllEvents(page = 1, limit = 50): Observable<CalendarEvent[]> {
    return this.getAll(page, limit);
  }

  getEventById(id: string): Observable<CalendarEvent | null> {
    return this.getById(id);
  }

  createEvent(
    event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<CalendarEvent | null> {
    return this.create(event);
  }

  updateEvent(id: string | number, event: Partial<CalendarEvent>): Observable<CalendarEvent | null> {
    return this.update(id, event);
  }

  deleteEvent(id: string | number): Observable<boolean> {
    return this.delete(id);
  }

  searchEvents(query: string, page = 1, limit = 50): Observable<CalendarEvent[]> {
    return this.search(query, page, limit);
  }

  getEventsByCategory(categoryId: string): Observable<CalendarEvent[]> {
    return this.getAllEvents().pipe(
      map((events) =>
        events.filter((event) =>
          this.matchesCategory(event, categoryId)
        )
      ),
      catchError((error) => {
        this.logger.error('Erro ao buscar eventos por categoria', error as Record<string, unknown>);
        this.setError(error);
        return of([]);
      })
    );
  }

  getRecurringEvents(startDate: Date, endDate: Date): Observable<CalendarEvent[]> {
    return this.getEventsByDateRange(startDate, endDate).pipe(
      map((events) => events.filter((event) => Boolean(event.recurrence))),
      catchError((error) => {
        this.logger.error('Erro ao buscar eventos recorrentes', error as Record<string, unknown>);
        this.setError(error);
        return of([]);
      })
    );
  }

  private matchesCategory(event: CalendarEvent, categoryId: string): boolean {
    const category = event.category;
    if (!category) {
      return false;
    }

    return String(category.id) === categoryId;
  }
}
