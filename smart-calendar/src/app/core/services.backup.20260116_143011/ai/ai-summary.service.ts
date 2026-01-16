import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.component';

export interface DailySummary {
  date: Date;
  totalEvents: number;
  totalTasks: number;
  completedTasks: number;
  productivityScore: number;
  highlights: string[];
  topCategories: { name: string; count: number }[];
  timeBreakdown: { category: string; minutes: number }[];
}

export interface WeeklySummary {
  weekStart: Date;
  weekEnd: Date;
  totalHoursScheduled: number;
  completionRate: number;
  mostProductiveDay: string;
  insights: string[];
  goalsProgress: { goal: string; progress: number }[];
}

export interface MeetingSummary {
  meetingId: string;
  keyPoints: string[];
  actionItems: { task: string; assignee?: string; dueDate?: Date }[];
  decisions: string[];
  nextSteps: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

@Injectable({
  providedIn: 'root'
})
export class AiSummaryService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/ai/summary`;

  getDailySummary(date: Date): Observable<DailySummary> {
    return this.http.post<DailySummary>(`${this.apiUrl}/daily`, { date }).pipe(
      catchError(() => of(this.getMockDailySummary(date)))
    );
  }

  getWeeklySummary(weekStart: Date): Observable<WeeklySummary> {
    return this.http.post<WeeklySummary>(`${this.apiUrl}/weekly`, { weekStart }).pipe(
      catchError(() => of(this.getMockWeeklySummary(weekStart)))
    );
  }

  getMeetingSummary(meetingId: string, notes?: string): Observable<MeetingSummary> {
    return this.http.post<MeetingSummary>(`${this.apiUrl}/meeting/${meetingId}`, { notes }).pipe(
      catchError(() => of(this.getMockMeetingSummary(meetingId)))
    );
  }

  generateInsights(period: { start: Date; end: Date }): Observable<string[]> {
    return this.http.post<string[]>(`${this.apiUrl}/insights`, period).pipe(
      catchError(() => of(this.getMockInsights()))
    );
  }

  summarizeText(text: string, maxLength = 200): Observable<string> {
    return this.http.post<{ summary: string }>(`${this.apiUrl}/text`, { text, maxLength }).pipe(
      catchError(() => of({ summary: text.substring(0, maxLength) + '...' }))
    ).pipe(
      catchError(() => of(''))
    );
  }

  private getMockDailySummary(date: Date): DailySummary {
    return {
      date,
      totalEvents: 8,
      totalTasks: 12,
      completedTasks: 9,
      productivityScore: 78,
      highlights: [
        'Completou 75% das tarefas planejadas',
        'Participou de 3 reuniões importantes',
        'Manteve 2 horas de foco ininterrupto'
      ],
      topCategories: [
        { name: 'Trabalho', count: 5 },
        { name: 'Reuniões', count: 3 },
        { name: 'Pessoal', count: 2 }
      ],
      timeBreakdown: [
        { category: 'Reuniões', minutes: 180 },
        { category: 'Foco profundo', minutes: 240 },
        { category: 'E-mails', minutes: 60 },
        { category: 'Pausas', minutes: 45 }
      ]
    };
  }

  private getMockWeeklySummary(weekStart: Date): WeeklySummary {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return {
      weekStart,
      weekEnd,
      totalHoursScheduled: 42,
      completionRate: 0.82,
      mostProductiveDay: 'Terça-feira',
      insights: [
        'Produtividade 15% acima da média',
        'Melhor foco nas manhãs de terça e quinta',
        'Reuniões ocuparam 35% do tempo',
        'Taxa de conclusão de tarefas melhorou 10%'
      ],
      goalsProgress: [
        { goal: 'Completar projeto X', progress: 0.65 },
        { goal: 'Melhorar foco diário', progress: 0.80 },
        { goal: 'Reduzir reuniões', progress: 0.45 }
      ]
    };
  }

  private getMockMeetingSummary(meetingId: string): MeetingSummary {
    return {
      meetingId,
      keyPoints: [
        'Discussão sobre nova funcionalidade',
        'Revisão de prazos do projeto',
        'Alinhamento de prioridades do trimestre'
      ],
      actionItems: [
        { task: 'Criar documento de requisitos', assignee: 'João', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
        { task: 'Revisar proposta com stakeholders', assignee: 'Maria' },
        { task: 'Agendar próxima reunião', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
      ],
      decisions: [
        'Priorizar feature A sobre feature B',
        'Aumentar frequência de syncs para semanal'
      ],
      nextSteps: [
        'Equipe de design inicia wireframes',
        'Tech lead define arquitetura',
        'PO valida escopo com cliente'
      ],
      sentiment: 'positive'
    };
  }

  private getMockInsights(): string[] {
    return [
      'Você é 40% mais produtivo nas manhãs de terça e quinta',
      'Reuniões após 16h têm 60% menos engajamento',
      'Tarefas agendadas com 2 dias de antecedência têm 85% de conclusão',
      'Blocos de foco de 90 minutos são ideais para você',
      'Você trabalha melhor em categorias de tarefas similares em sequência'
    ];
  }
}
