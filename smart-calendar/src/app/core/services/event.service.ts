import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Event } from '../models/event.model';
import { ApiMapperService } from './api-mapper.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/api/events`;
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  events$ = this.eventsSubject.asObservable();

  constructor(private http: HttpClient, private mapper: ApiMapperService) {
    this.loadEvents();
  }

  private loadEvents() {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // Carrega eventos do último mês
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 2); // Até dois meses à frente

    this.getEventsByDateRange(startDate, endDate).subscribe(
      (events) => this.eventsSubject.next(events),
      (error) => console.error('Erro ao carregar eventos:', error)
    );
  }

  getEventsByDateRange(startDate: Date, endDate: Date): Observable<Event[]> {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    return this.http
      .get<Event[]>(this.apiUrl, { params })
      .pipe(map((events) => events.map((e) => this.mapper.fromApiEvent(e))));
  }

  getEventById(id: string): Observable<Event> {
    return this.http
      .get<Event>(`${this.apiUrl}/${id}`)
      .pipe(map((e) => this.mapper.fromApiEvent(e)));
  }

  createEvent(
    event: Omit<Event, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>
  ): Observable<Event> {
    const payload = this.mapper.toApiEvent(event as any);
    return this.http.post<Event>(this.apiUrl, payload).pipe(
      map((e) => this.mapper.fromApiEvent(e)),
      tap((ev) => this.eventsSubject.next([...this.eventsSubject.value, ev]))
    );
  }

  updateEvent(id: string, event: Partial<Event>): Observable<Event> {
    const payload = this.mapper.toApiEvent(event as any);
    return this.http.patch<Event>(`${this.apiUrl}/${id}`, payload).pipe(
      map((e) => this.mapper.fromApiEvent(e)),
      tap((updatedEvent) => {
        const currentEvents = this.eventsSubject.value;
        const idx = currentEvents.findIndex((ev) => ev.id === id);
        if (idx !== -1) {
          currentEvents[idx] = updatedEvent;
          this.eventsSubject.next([...currentEvents]);
        }
      })
    );
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentEvents = this.eventsSubject.value;
        this.eventsSubject.next(currentEvents.filter((e) => e.id !== id));
      })
    );
  }

  searchEvents(query: string): Observable<Event[]> {
    return this.http
      .get<Event[]>(`${this.apiUrl}/search`, {
        params: { q: query },
      })
      .pipe(
        map((events) =>
          events.map((event) => ({
            ...event,
            startDate: event.startDate ? new Date(event.startDate) : undefined,
            endDate: event.endDate ? new Date(event.endDate) : undefined,
            createdAt: event.createdAt ? new Date(event.createdAt) : new Date(),
            updatedAt: event.updatedAt ? new Date(event.updatedAt) : new Date(),
          }))
        )
      );
  }

  getEventsByCategory(categoryId: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/category/${categoryId}`).pipe(
      map((events) =>
        events.map((event) => ({
          ...event,
          startDate: event.startDate ? new Date(event.startDate) : undefined,
          endDate: event.endDate ? new Date(event.endDate) : undefined,
          createdAt: event.createdAt ? new Date(event.createdAt) : new Date(),
          updatedAt: event.updatedAt ? new Date(event.updatedAt) : new Date(),
        }))
      )
    );
  }

  getRecurringEvents(startDate: Date, endDate: Date): Observable<Event[]> {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      recurring: 'true',
    };

    return this.http.get<Event[]>(`${this.apiUrl}/recurring`, { params }).pipe(
      map((events) =>
        events.map((event) => ({
          ...event,
          startDate: event.startDate ? new Date(event.startDate) : undefined,
          endDate: event.endDate ? new Date(event.endDate) : undefined,
          createdAt: event.createdAt ? new Date(event.createdAt) : new Date(),
          updatedAt: event.updatedAt ? new Date(event.updatedAt) : new Date(),
        }))
      )
    );
  }
}
