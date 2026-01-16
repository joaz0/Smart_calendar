import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface TimestampNote {
  id: string;
  eventId?: string;
  timestamp: Date;
  content: string;
  tags?: string[];
  attachments?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TimestampNotesService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/context/notes`;

  addNote(note: Omit<TimestampNote, 'id'>): Observable<TimestampNote> {
    return this.http.post<TimestampNote>(`${this.apiUrl}`, note).pipe(
      catchError(() => of({ ...note, id: Date.now().toString() } as TimestampNote))
    );
  }

  getNotes(eventId?: string): Observable<TimestampNote[]> {
    return this.http.get<TimestampNote[]>(`${this.apiUrl}`, { params: { eventId: eventId || '' } }).pipe(
      catchError(() => of([]))
    );
  }

  updateNote(id: string, updates: Partial<TimestampNote>): Observable<TimestampNote> {
    return this.http.patch<TimestampNote>(`${this.apiUrl}/${id}`, updates).pipe(
      catchError(() => of({} as TimestampNote))
    );
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }

  searchNotes(query: string): Observable<TimestampNote[]> {
    return this.http.get<TimestampNote[]>(`${this.apiUrl}/search`, { params: { q: query } }).pipe(
      catchError(() => of([]))
    );
  }
}
