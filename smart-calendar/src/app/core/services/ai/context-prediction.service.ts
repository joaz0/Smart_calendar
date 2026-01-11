import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface ContextPrediction {
  context: string;
  probability: number;
  suggestedActions: string[];
  relatedEvents: string[];
}

export interface UserContext {
  location?: string;
  activity?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: string;
  currentMood?: 'productive' | 'relaxed' | 'stressed' | 'neutral';
}

export interface ContextualSuggestion {
  type: 'task' | 'break' | 'meeting' | 'focus';
  title: string;
  description: string;
  priority: number;
  reasoning: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContextPredictionService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/ai/context`;

  constructor(private http: HttpClient) {}

  predictNextContext(currentContext: UserContext): Observable<ContextPrediction> {
    return this.http.post<ContextPrediction>(`${this.apiUrl}/predict`, currentContext).pipe(
      catchError(() => of(this.getMockPrediction(currentContext)))
    );
  }

  getSuggestionsForContext(context: UserContext): Observable<ContextualSuggestion[]> {
    return this.http.post<ContextualSuggestion[]>(`${this.apiUrl}/suggestions`, context).pipe(
      catchError(() => of(this.getMockSuggestions(context)))
    );
  }

  detectContextChange(previousContext: UserContext, currentContext: UserContext): Observable<{ changed: boolean; significance: number }> {
    return this.http.post<any>(`${this.apiUrl}/detect-change`, {
      previous: previousContext,
      current: currentContext
    }).pipe(
      catchError(() => of({ changed: true, significance: 0.7 }))
    );
  }

  getOptimalTimeForActivity(activity: string, preferences: any = {}): Observable<{ time: Date; confidence: number }> {
    return this.http.post<any>(`${this.apiUrl}/optimal-time`, { activity, preferences }).pipe(
      catchError(() => {
        const optimalTime = new Date();
        optimalTime.setHours(9, 0, 0, 0);
        return of({ time: optimalTime, confidence: 0.75 });
      })
    );
  }

  private getMockPrediction(context: UserContext): ContextPrediction {
    const predictions: { [key: string]: ContextPrediction } = {
      morning: {
        context: 'Sessão de foco profundo',
        probability: 0.85,
        suggestedActions: ['Trabalhar em tarefas complexas', 'Revisar pendências importantes'],
        relatedEvents: ['Reunião de equipe', 'Planejamento diário']
      },
      afternoon: {
        context: 'Colaboração e comunicação',
        probability: 0.78,
        suggestedActions: ['Agendar reuniões', 'Responder e-mails', 'Trabalho em equipe'],
        relatedEvents: ['Calls do time', 'Revisões de projeto']
      },
      evening: {
        context: 'Finalização e planejamento',
        probability: 0.72,
        suggestedActions: ['Revisar tarefas do dia', 'Planejar amanhã', 'Organizar pendências'],
        relatedEvents: ['Retrospectiva diária', 'Preparação para amanhã']
      },
      night: {
        context: 'Descanso e reflexão',
        probability: 0.9,
        suggestedActions: ['Descansar', 'Leitura leve', 'Preparar para dormir'],
        relatedEvents: []
      }
    };

    return predictions[context.timeOfDay] || predictions.morning;
  }

  private getMockSuggestions(context: UserContext): ContextualSuggestion[] {
    const suggestions: { [key: string]: ContextualSuggestion[] } = {
      morning: [
        {
          type: 'focus',
          title: 'Sessão de foco de 90 minutos',
          description: 'Seu pico de produtividade é pela manhã',
          priority: 10,
          reasoning: 'Análise de padrões históricos mostra 45% mais produtividade neste horário'
        },
        {
          type: 'task',
          title: 'Trabalhar em tarefas complexas',
          description: 'Resolva problemas difíceis enquanto está descansado',
          priority: 9,
          reasoning: 'Capacidade cognitiva está no pico'
        }
      ],
      afternoon: [
        {
          type: 'meeting',
          title: 'Agendar reuniões colaborativas',
          description: 'Melhor horário para trabalho em equipe',
          priority: 8,
          reasoning: 'Energia social está alta no período da tarde'
        },
        {
          type: 'break',
          title: 'Pausa ativa de 15 minutos',
          description: 'Combater a queda pós-almoço',
          priority: 7,
          reasoning: 'Prevenção de queda de produtividade típica das 14h-15h'
        }
      ],
      evening: [
        {
          type: 'task',
          title: 'Revisar pendências do dia',
          description: 'Preparar para o dia seguinte',
          priority: 6,
          reasoning: 'Closure diário ajuda na organização mental'
        }
      ],
      night: [
        {
          type: 'break',
          title: 'Rotina de descanso',
          description: 'Preparar para dormir',
          priority: 10,
          reasoning: 'Higiene do sono é crucial para produtividade'
        }
      ]
    };

    return suggestions[context.timeOfDay] || [];
  }
}
