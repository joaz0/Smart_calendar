import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MATERIAL_COLORS } from '../../../shared/tokens/color-tokens';

export interface ContextBlock {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  color: string;
  activities: string[];
  focusLevel: 'deep' | 'moderate' | 'light';
  allowInterruptions: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ContextBlocksService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/context/blocks`;

  getContextBlocks(date: Date): Observable<ContextBlock[]> {
    return this.http.post<ContextBlock[]>(`${this.apiUrl}/list`, { date }).pipe(
      catchError(() => of([{
        id: '1',
        name: 'Foco Profundo',
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        color: MATERIAL_COLORS.blue,
        activities: ['desenvolvimento', 'design'],
        focusLevel: 'deep',
        allowInterruptions: false
      }]))
    );
  }

  createContextBlock(block: Omit<ContextBlock, 'id'>): Observable<ContextBlock> {
    return this.http.post<ContextBlock>(`${this.apiUrl}`, block).pipe(
      catchError(() => of({ ...block, id: Date.now().toString() } as ContextBlock))
    );
  }

  updateContextBlock(id: string, updates: Partial<ContextBlock>): Observable<ContextBlock> {
    return this.http.patch<ContextBlock>(`${this.apiUrl}/${id}`, updates).pipe(
      catchError(() => of({} as ContextBlock))
    );
  }

  deleteContextBlock(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }
}
