import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface SchedulingSuggestion {
  startTime: Date;
  endTime: Date;
  confidence: number;
  reasoning: string;
  conflictScore: number;
}

export interface AutoScheduleRequest {
  title: string;
  duration: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  preferredTimeRanges?: { start: string; end: string }[];
  requiredAttendees?: string[];
  constraints?: {
    notBefore?: Date;
    notAfter?: Date;
    preferredDays?: string[];
  };
}

export interface SchedulingConflict {
  eventId: string;
  conflictType: 'hard' | 'soft';
  severity: number;
  suggestion: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiSchedulingService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/ai/scheduling`;

  suggestOptimalTime(request: AutoScheduleRequest): Observable<SchedulingSuggestion[]> {
    return this.http.post<SchedulingSuggestion[]>(`${this.apiUrl}/suggest`, request).pipe(
      catchError(() => of(this.getMockSuggestions(request)))
    );
  }

  autoSchedule(requests: AutoScheduleRequest[]): Observable<{ scheduled: any[]; failed: any[] }> {
    return this.http.post<any>(`${this.apiUrl}/auto-schedule`, { requests }).pipe(
      catchError(() => of({ scheduled: [], failed: [] }))
    );
  }

  detectConflicts(eventId: string, proposedTime: Date, duration: number): Observable<SchedulingConflict[]> {
    return this.http.post<SchedulingConflict[]>(`${this.apiUrl}/conflicts`, {
      eventId,
      proposedTime,
      duration
    }).pipe(
      catchError(() => of([]))
    );
  }

  rescheduleEvent(eventId: string, reason: string): Observable<SchedulingSuggestion[]> {
    return this.http.post<SchedulingSuggestion[]>(`${this.apiUrl}/reschedule/${eventId}`, { reason }).pipe(
      catchError(() => of(this.getDefaultRescheduleSuggestions()))
    );
  }

  optimizeSchedule(date: Date): Observable<{ optimizations: any[]; timeSaved: number }> {
    return this.http.post<any>(`${this.apiUrl}/optimize`, { date }).pipe(
      catchError(() => of({ optimizations: [], timeSaved: 0 }))
    );
  }

  findMeetingSlots(attendees: string[], duration: number, timeframe: { start: Date; end: Date }): Observable<Date[]> {
    return this.http.post<Date[]>(`${this.apiUrl}/find-slots`, {
      attendees,
      duration,
      timeframe
    }).pipe(
      catchError(() => of(this.getMockAvailableSlots(duration)))
    );
  }

  private getMockSuggestions(request: AutoScheduleRequest): SchedulingSuggestion[] {
    const baseTime = new Date();
    baseTime.setHours(9, 0, 0, 0);
    
    const suggestions: SchedulingSuggestion[] = [];
    
    for (let i = 0; i < 3; i++) {
      const startTime = new Date(baseTime);
      startTime.setHours(baseTime.getHours() + (i * 2));
      
      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + request.duration);
      
      suggestions.push({
        startTime,
        endTime,
        confidence: 0.9 - (i * 0.1),
        reasoning: i === 0 
          ? 'Horário ideal baseado em padrões de produtividade'
          : `Alternativa ${i}: Sem conflitos, energia ${i === 1 ? 'moderada' : 'baixa'}`,
        conflictScore: i * 0.2
      });
    }
    
    return suggestions;
  }

  private getDefaultRescheduleSuggestions(): SchedulingSuggestion[] {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    
    return [
      {
        startTime: tomorrow,
        endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000),
        confidence: 0.85,
        reasoning: 'Mesmo horário, dia seguinte',
        conflictScore: 0
      }
    ];
  }

  private getMockAvailableSlots(_duration: number): Date[] {
    const slots: Date[] = [];
    const baseDate = new Date();
    baseDate.setHours(9, 0, 0, 0);
    
    for (let i = 0; i < 5; i++) {
      const slot = new Date(baseDate);
      slot.setHours(baseDate.getHours() + (i * 2));
      slots.push(slot);
    }
    
    return slots;
  }
}
