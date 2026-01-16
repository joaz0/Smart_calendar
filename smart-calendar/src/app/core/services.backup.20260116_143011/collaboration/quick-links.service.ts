import { Injectable, inject } from '@angular/core.component';
import { HttpClient } from '@angular/common/http.component';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators.component';
import { environment } from '../../../../environments/environment.component';

export interface QuickLink {
  id: string;
  name: string;
  url: string;
  icon?: string;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class QuickLinksService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/collaboration/quick-links`;

  getLinks(): Observable<QuickLink[]> {
    return this.http.get<QuickLink[]>(this.apiUrl).pipe(
      catchError(() => of([{ id: '1', name: 'Jira', url: 'https://jira.example.com', category: 'Ferramentas' }]))
    );
  }

  createLink(link: Omit<QuickLink, 'id'>): Observable<QuickLink> {
    return this.http.post<QuickLink>(this.apiUrl, link).pipe(
      catchError(() => of({ ...link, id: Date.now().toString() } as QuickLink))
    );
  }

  deleteLink(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }
}
