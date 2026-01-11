import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface PersonalTimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  days: string[];
  protected: boolean;
}

@Injectable({ providedIn: 'root' })
export class PersonalTimeGuardService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/wellness/personal-time`;

  constructor(private http: HttpClient) {}

  getProtectedBlocks(): Observable<PersonalTimeBlock[]> {
    return this.http.get<PersonalTimeBlock[]>(this.apiUrl).pipe(
      catchError(() => of([
        {
          id: '1',
          startTime: '18:00',
          endTime: '22:00',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          protected: true
        }
      ]))
    );
  }

  createBlock(block: Omit<PersonalTimeBlock, 'id'>): Observable<PersonalTimeBlock> {
    return this.http.post<PersonalTimeBlock>(this.apiUrl, block).pipe(
      catchError(() => of({ ...block, id: Date.now().toString() } as PersonalTimeBlock))
    );
  }

  deleteBlock(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }

  checkViolations(): Observable<{ count: number; details: string[] }> {
    return this.http.get<any>(`${this.apiUrl}/violations`).pipe(
      catchError(() => of({ count: 0, details: [] }))
    );
  }
}
