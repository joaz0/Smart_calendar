import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { Event } from '../models/event.model';

interface CreateEventRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  categoryId?: number;
  color?: string;
}

interface UpdateEventRequest extends Partial<CreateEventRequest> {}

interface EventListResponse {
  data: Event[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class EventApiService {
  private apiService = inject(ApiService);

  private eventsSubject = new BehaviorSubject<Event[]>([]);
  events$ = this.eventsSubject.asObservable();

  /**
   * Obter eventos por intervalo de datas
   */
  getEventsByDateRange(
    startDate: Date,
    endDate: Date,
    page = 1,
    limit = 50
  ): Observable<EventListResponse> {
    const params = {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        page: page.toString(),
        limit: limit.toString(),
      },
    };

    return this.apiService.get<EventListResponse>('/events', params).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao buscar eventos');
      })
    );
  }

  /**
   * Obter todos os eventos
   */
  getAllEvents(page = 1, limit = 50): Observable<EventListResponse> {
    const params = {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    };

    return this.apiService.get<EventListResponse>('/events', params).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao buscar eventos');
      })
    );
  }

  /**
   * Obter evento por ID
   */
  getEventById(id: number): Observable<Event> {
    return this.apiService.get<Event>(`/events/${id}`).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Evento não encontrado');
      })
    );
  }

  /**
   * Criar novo evento
   */
  createEvent(_event: CreateEventRequest): Observable<Event> {
    return this.apiService.post<Event>('/events', event).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao criar evento');
      })
    );
  }

  /**
   * Atualizar evento
   */
  updateEvent(id: number, event: UpdateEventRequest): Observable<Event> {
    return this.apiService.patch<Event>(`/events/${id}`, event).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao atualizar evento');
      })
    );
  }

  /**
   * Deletar evento
   */
  deleteEvent(id: number): Observable<void> {
    return this.apiService.delete<void>(`/events/${id}`).pipe(
      map((response) => {
        if (response.success) {
          return undefined;
        }
        throw new Error(response.error || 'Erro ao deletar evento');
      })
    );
  }

  /**
   * Buscar eventos por texto
   */
  searchEvents(query: string, page = 1, limit = 20): Observable<EventListResponse> {
    const params = {
      params: {
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      },
    };

    return this.apiService.get<EventListResponse>('/events/search', params).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao buscar eventos');
      })
    );
  }

  /**
   * Atualizar eventos no subject
   */
  updateEventsSubject(events: Event[]): void {
    this.eventsSubject.next(events);
  }

  /**
   * Obter eventos do subject
   */
  getEventsFromSubject(): Event[] {
    return this.eventsSubject.value;
  }
}
