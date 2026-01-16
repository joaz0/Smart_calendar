import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Event } from '../models/event.model';
import { EventApiService } from './event-api.service';
import { Logger } from '../utils/logger';


interface EventListResponse {
  data: Event[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventApiService = inject(EventApiService);

  private eventsSubject = new BehaviorSubject<Event[]>([]);
  events$ = this.eventsSubject.asObservable();

  private logger = new Logger('EventService');

  constructor() {
    this.loadEvents();
  }

  private loadEvents() {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // Carrega eventos do último mês
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 2); // Até dois meses à frente

    this.getEventsByDateRange(startDate, endDate).subscribe({
      next: (events) => {
        this.logger.info('Eventos carregados com sucesso', { count: events.length });
        this.eventsSubject.next(events);
      },
      error: (error) => this.logger.error('Erro ao carregar eventos', error),
    });
  }

  getEventsByDateRange(startDate: Date, endDate: Date, page = 1, limit = 50): Observable<Event[]> {
    return this.eventApiService.getEventsByDateRange(startDate, endDate, page, limit).pipe(
      map((response) => response.data),
      catchError((error) => {
        this.logger.error('Erro ao buscar eventos por intervalo de datas', error);
        return of([]);
      })
    );
  }

  getAllEvents(page = 1, limit = 50): Observable<Event[]> {
    return this.eventApiService.getAllEvents(page, limit).pipe(
      map((response) => response.data),
      catchError((error) => {
        this.logger.error('Erro ao buscar todos os eventos', error);
        return of([]);
      })
    );
  }

  getEventById(id: string): Observable<Event | null> {
    return this.eventApiService.getEventById(Number(id)).pipe(
      catchError((error) => {
        this.logger.error('Erro ao buscar evento por ID', error);
        return of(null);
      })
    );
  }

  createEvent(
    event: Omit<Event, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>
  ): Observable<Event> {
    this.logger.info('Criando novo evento', { title: event.title });
    return this.eventApiService.createEvent(event as any).pipe(
      tap((newEvent) => {
        this.logger.info('Evento criado com sucesso', { id: newEvent.id });
        this.eventsSubject.next([...this.eventsSubject.value, newEvent]);
      }),
      catchError((error) => {
        this.logger.error('Erro ao criar evento', error);
        throw error;
      })
    );
  }

  updateEvent(id: string, event: Partial<Event>): Observable<Event> {
    this.logger.info('Atualizando evento', { id });
    const updateRequest: any = {
      ...event,
      startDate: event.startDate instanceof Date ? event.startDate.toISOString() : event.startDate,
      endDate: event.endDate instanceof Date ? event.endDate.toISOString() : event.endDate,
    };
    return this.eventApiService.updateEvent(Number(id), updateRequest).pipe(
      tap((updatedEvent) => {
        this.logger.info('Evento atualizado com sucesso', { id });
        const currentEvents = this.eventsSubject.value;
        const idx = currentEvents.findIndex((ev) => ev.id === id);
        if (idx !== -1) {
          currentEvents[idx] = updatedEvent;
          this.eventsSubject.next([...currentEvents]);
        }
      }),
      catchError((error) => {
        this.logger.error('Erro ao atualizar evento', error);
        throw error;
      })
    );
  }

  deleteEvent(id: string): Observable<void> {
    this.logger.info('Deletando evento', { id });
    return this.eventApiService.deleteEvent(Number(id)).pipe(
      tap(() => {
        this.logger.info('Evento deletado com sucesso', { id });
        const currentEvents = this.eventsSubject.value;
        this.eventsSubject.next(currentEvents.filter((e) => e.id !== id));
      }),
      catchError((error) => {
        this.logger.error('Erro ao deletar evento', error);
        throw error;
      })
    );
  }

  searchEvents(query: string, page = 1, limit = 50): Observable<Event[]> {
    this.logger.info('Buscando eventos', { query });
    return this.eventApiService.searchEvents(query, page, limit).pipe(
      map((response) => response.data),
      catchError((error) => {
        this.logger.error('Erro ao buscar eventos', error);
        return of([]);
      })
    );
  }

  getEventsByCategory(categoryId: string): Observable<Event[]> {
    this.logger.info('Buscando eventos por categoria', { categoryId });
    return this.getAllEvents().pipe(
      map((events) => events.filter((e) => e.category?.id === categoryId)),
      catchError((error) => {
        this.logger.error('Erro ao buscar eventos por categoria', error);
        return of([]);
      })
    );
  }

  getRecurringEvents(startDate: Date, endDate: Date): Observable<Event[]> {
    this.logger.info('Buscando eventos recorrentes', { startDate, endDate });
    return this.getEventsByDateRange(startDate, endDate).pipe(
      map((events) => events.filter((e) => e.recurrence)),
      catchError((error) => {
        this.logger.error('Erro ao buscar eventos recorrentes', error);
        return of([]);
      })
    );
  }
}
