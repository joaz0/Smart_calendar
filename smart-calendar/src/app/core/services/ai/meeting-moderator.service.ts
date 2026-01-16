import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, interval } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface MeetingAgendaItem {
  id: string;
  topic: string;
  duration: number;
  presenter?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
}

export interface MeetingInsight {
  type: 'time_warning' | 'participation' | 'action_item' | 'decision';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface ParticipationMetrics {
  participantId: string;
  participantName: string;
  speakingTime: number;
  contributions: number;
  engagement: number;
}

export interface MeetingHealth {
  overallScore: number;
  timeManagement: number;
  participation: number;
  productivity: number;
  warnings: string[];
  suggestions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MeetingModeratorService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/ai/meeting`;

  generateAgenda(meetingTitle: string, participants: string[], duration: number): Observable<MeetingAgendaItem[]> {
    return this.http.post<MeetingAgendaItem[]>(`${this.apiUrl}/generate-agenda`, {
      title: meetingTitle,
      participants,
      duration
    }).pipe(
      catchError(() => of(this.getMockAgenda(duration)))
    );
  }

  monitorMeetingHealth(meetingId: string): Observable<MeetingHealth> {
    return this.http.get<MeetingHealth>(`${this.apiUrl}/health/${meetingId}`).pipe(
      catchError(() => of(this.getMockMeetingHealth()))
    );
  }

  trackParticipation(meetingId: string): Observable<ParticipationMetrics[]> {
    return this.http.get<ParticipationMetrics[]>(`${this.apiUrl}/participation/${meetingId}`).pipe(
      catchError(() => of(this.getMockParticipationMetrics()))
    );
  }

  suggestNextAction(meetingId: string, currentAgendaItem: string): Observable<{ action: string; reasoning: string }> {
    return this.http.post<any>(`${this.apiUrl}/next-action`, { meetingId, currentAgendaItem }).pipe(
      catchError(() => of({
        action: 'Mover para próximo tópico',
        reasoning: 'Tópico atual já consumiu tempo alocado'
      }))
    );
  }

  detectDecisions(meetingId: string, transcript: string): Observable<string[]> {
    return this.http.post<string[]>(`${this.apiUrl}/detect-decisions`, { meetingId, transcript }).pipe(
      catchError(() => of([
        'Aprovar proposta de design',
        'Agendar follow-up para próxima semana',
        'Aumentar orçamento do projeto em 10%'
      ]))
    );
  }

  extractActionItems(transcript: string): Observable<{ task: string; assignee?: string; dueDate?: string }[]> {
    return this.http.post<any[]>(`${this.apiUrl}/action-items`, { transcript }).pipe(
      catchError(() => of([
        { task: 'Preparar apresentação', assignee: 'João', dueDate: '2026-01-15' },
        { task: 'Revisar documento', assignee: 'Maria' },
        { task: 'Agendar próxima reunião' }
      ]))
    );
  }

  getRealTimeInsights(meetingId: string): Observable<MeetingInsight[]> {
    return interval(30000).pipe(
      map(() => this.getMockInsights())
    );
  }

  suggestTimeboxing(agenda: MeetingAgendaItem[], totalDuration: number): Observable<MeetingAgendaItem[]> {
    return this.http.post<MeetingAgendaItem[]>(`${this.apiUrl}/timebox`, { agenda, totalDuration }).pipe(
      catchError(() => of(this.optimizeAgendaTiming(agenda, totalDuration)))
    );
  }

  private getMockAgenda(_duration: number): MeetingAgendaItem[] {
    const itemCount = Math.max(3, Math.floor(duration / 15));
    const itemDuration = Math.floor(duration / itemCount);

    return Array.from({ length: itemCount }, (_, i) => ({
      id: `item-${i + 1}`,
      topic: `Tópico ${i + 1}`,
      duration: itemDuration,
      status: 'pending' as const
    }));
  }

  private getMockMeetingHealth(): MeetingHealth {
    return {
      overallScore: 75,
      timeManagement: 80,
      participation: 70,
      productivity: 75,
      warnings: [
        'Reunião está 10 minutos atrasada',
        'Participação desigual detectada'
      ],
      suggestions: [
        'Considere fazer um round-robin para engajar todos',
        'Restam 15 minutos - priorize tópicos essenciais'
      ]
    };
  }

  private getMockParticipationMetrics(): ParticipationMetrics[] {
    return [
      { participantId: '1', participantName: 'João Silva', speakingTime: 300, contributions: 8, engagement: 85 },
      { participantId: '2', participantName: 'Maria Santos', speakingTime: 240, contributions: 6, engagement: 78 },
      { participantId: '3', participantName: 'Pedro Costa', speakingTime: 120, contributions: 3, engagement: 55 },
      { participantId: '4', participantName: 'Ana Oliveira', speakingTime: 180, contributions: 5, engagement: 70 }
    ];
  }

  private getMockInsights(): MeetingInsight[] {
    return [
      {
        type: 'time_warning',
        message: 'Tópico atual excedeu tempo alocado em 5 minutos',
        severity: 'medium',
        timestamp: new Date()
      },
      {
        type: 'participation',
        message: '2 participantes ainda não contribuíram',
        severity: 'low',
        timestamp: new Date()
      },
      {
        type: 'action_item',
        message: 'Nova ação item detectada: Revisar proposta',
        severity: 'medium',
        timestamp: new Date()
      }
    ];
  }

  private optimizeAgendaTiming(agenda: MeetingAgendaItem[], totalDuration: number): MeetingAgendaItem[] {
    const itemDuration = Math.floor(totalDuration / agenda.length);
    return agenda.map(item => ({
      ...item,
      duration: itemDuration
    }));
  }
}
