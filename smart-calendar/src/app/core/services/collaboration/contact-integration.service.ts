import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContactIntegrationService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/collaboration/contacts`;

  constructor(private http: HttpClient) {}

  searchContacts(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`, { params: { q: query } }).pipe(
      catchError(() => of([]))
    );
  }

  getRecentContacts(limit = 10): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recent`, { params: { limit: limit.toString() } }).pipe(
      catchError(() => of([]))
    );
  }
}
