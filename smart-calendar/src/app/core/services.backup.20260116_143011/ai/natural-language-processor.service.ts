import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.component';


export interface ParsedEvent {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  attendees?: string[];
  category?: string;
  priority?: string;
  confidence: number;
}

export interface ParsedTask {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  estimatedDuration?: number;
  confidence: number;
}

export interface NLPIntent {
  intent: 'create_event' | 'create_task' | 'search' | 'update' | 'delete' | 'query';
  confidence: number;
  entities: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class NaturalLanguageProcessorService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/ai/nlp`;

  parseEventFromText(text: string): Observable<ParsedEvent> {
    return this.http.post<ParsedEvent>(`${this.apiUrl}/parse-event`, { text }).pipe(
      catchError(() => of(this.getMockParsedEvent(text)))
    );
  }

  parseTaskFromText(text: string): Observable<ParsedTask> {
    return this.http.post<ParsedTask>(`${this.apiUrl}/parse-task`, { text }).pipe(
      catchError(() => of(this.getMockParsedTask(text)))
    );
  }

  detectIntent(text: string): Observable<NLPIntent> {
    return this.http.post<NLPIntent>(`${this.apiUrl}/intent`, { text }).pipe(
      catchError(() => of(this.getMockIntent(text)))
    );
  }

  extractDatetime(text: string): Observable<{ date?: Date; time?: string; confidence: number }> {
    return this.http.post<any>(`${this.apiUrl}/extract-datetime`, { text }).pipe(
      catchError(() => of(this.extractDatetimeLocal(text)))
    );
  }

  suggestCompletions(partialText: string): Observable<string[]> {
    return this.http.post<string[]>(`${this.apiUrl}/completions`, { text: partialText }).pipe(
      catchError(() => of(this.getMockCompletions(partialText)))
    );
  }

  private getMockParsedEvent(text: string): ParsedEvent {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);

    return {
      title: text.length > 30 ? text.substring(0, 30) + '...' : text,
      description: text,
      startDate: tomorrow,
      endDate: new Date(tomorrow.getTime() + 60 * 60 * 1000),
      confidence: 0.75
    };
  }

  private getMockParsedTask(text: string): ParsedTask {
    return {
      title: text.length > 50 ? text.substring(0, 50) + '...' : text,
      description: text,
      priority: 'medium',
      estimatedDuration: 60,
      confidence: 0.8
    };
  }

  private getMockIntent(text: string): NLPIntent {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('criar') || lowerText.includes('agendar') || lowerText.includes('adicionar')) {
      if (lowerText.includes('reunião') || lowerText.includes('evento')) {
        return {
          intent: 'create_event',
          confidence: 0.85,
          entities: { type: 'event' }
        };
      }
      return {
        intent: 'create_task',
        confidence: 0.8,
        entities: { type: 'task' }
      };
    }

    if (lowerText.includes('buscar') || lowerText.includes('procurar') || lowerText.includes('encontrar')) {
      return {
        intent: 'search',
        confidence: 0.9,
        entities: { query: text }
      };
    }

    return {
      intent: 'query',
      confidence: 0.6,
      entities: {}
    };
  }

  private extractDatetimeLocal(text: string): { date?: Date; time?: string; confidence: number } {
    const lowerText = text.toLowerCase();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (lowerText.includes('amanhã')) {
      return { date: tomorrow, confidence: 0.9 };
    }

    if (lowerText.includes('hoje')) {
      return { date: new Date(), confidence: 0.95 };
    }

    return { confidence: 0.3 };
  }

  private getMockCompletions(partialText: string): string[] {
    return [
      `${partialText} amanhã às 14h`,
      `${partialText} na próxima semana`,
      `${partialText} com alta prioridade`,
      `${partialText} no escritório`
    ];
  }
}
