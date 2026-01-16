import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


export interface Insight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'warning';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  suggestedActions?: string[];
  relatedData: Record<string, unknown>;
}

export interface TrendInsight {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  change: number;
  period: string;
  significance: number;
}

export interface AnomalyInsight {
  metric: string;
  expectedValue: number;
  actualValue: number;
  deviation: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class InsightGeneratorService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/insights`;

  generateInsights(period: { start: Date; end: Date }, categories?: string[]): Observable<Insight[]> {
    return this.http.post<Insight[]>(`${this.apiUrl}/generate`, { period, categories }).pipe(
      catchError(() => of(this.getMockInsights()))
    );
  }

  detectTrends(metric: string, period = 30): Observable<TrendInsight[]> {
    return this.http.post<TrendInsight[]>(`${this.apiUrl}/trends`, { metric, period }).pipe(
      catchError(() => of(this.getMockTrends(metric)))
    );
  }

  detectAnomalies(metrics: string[], threshold = 0.8): Observable<AnomalyInsight[]> {
    return this.http.post<AnomalyInsight[]>(`${this.apiUrl}/anomalies`, { metrics, threshold }).pipe(
      catchError(() => of([]))
    );
  }

  getPersonalizedInsights(userId: string): Observable<Insight[]> {
    return this.http.get<Insight[]>(`${this.apiUrl}/personalized/${userId}`).pipe(
      catchError(() => of(this.getMockInsights()))
    );
  }

  getPredictiveInsights(horizon = 7): Observable<Insight[]> {
    return this.http.post<Insight[]>(`${this.apiUrl}/predictive`, { horizon }).pipe(
      catchError(() => of(this.getMockPredictiveInsights()))
    );
  }

  private getMockInsights(): Insight[] {
    return [
      {
        id: '1',
        type: 'trend',
        title: 'Produtividade em alta',
        description: 'Sua produtividade aumentou 23% nas últimas 2 semanas',
        confidence: 0.92,
        actionable: true,
        suggestedActions: [
          'Mantenha sua rotina atual',
          'Documente o que está funcionando'
        ],
        relatedData: { metric: 'productivity', change: 23 }
      },
      {
        id: '2',
        type: 'anomaly',
        title: 'Reuniões acima do normal',
        description: 'Você teve 40% mais reuniões que o usual esta semana',
        confidence: 0.87,
        actionable: true,
        suggestedActions: [
          'Revise necessidade de todas as reuniões',
          'Considere consolidar algumas reuniões',
          'Bloqueie tempo para foco profundo'
        ],
        relatedData: { metric: 'meetings', deviation: 0.4 }
      },
      {
        id: '3',
        type: 'opportunity',
        title: 'Janela de tempo disponível',
        description: 'Você tem 3 horas livres na quarta-feira pela manhã',
        confidence: 0.95,
        actionable: true,
        suggestedActions: [
          'Agende tarefas complexas',
          'Use para trabalho de foco profundo'
        ],
        relatedData: { date: '2026-01-15', duration: 180 }
      },
      {
        id: '4',
        type: 'warning',
        title: 'Sobrecarga detectada',
        description: 'Próxima semana está 110% agendada',
        confidence: 0.89,
        actionable: true,
        suggestedActions: [
          'Reprogramar atividades não urgentes',
          'Delegar tarefas quando possível',
          'Adicionar buffer entre compromissos'
        ],
        relatedData: { utilization: 1.1, week: 'next' }
      }
    ];
  }

  private getMockTrends(metric: string): TrendInsight[] {
    return [
      {
        metric,
        direction: 'up',
        change: 15.5,
        period: 'last_week',
        significance: 0.85
      },
      {
        metric,
        direction: 'up',
        change: 8.2,
        period: 'last_month',
        significance: 0.78
      }
    ];
  }

  private getMockPredictiveInsights(): Insight[] {
    return [
      {
        id: 'pred-1',
        type: 'warning',
        title: 'Possível burnout detectado',
        description: 'Com base nos padrões atuais, risco de burnout em 2 semanas',
        confidence: 0.73,
        actionable: true,
        suggestedActions: [
          'Reduza carga de trabalho gradualmente',
          'Aumente tempo de descanso',
          'Agende férias ou dias off'
        ],
        relatedData: { risk_level: 'medium', days_ahead: 14 }
      },
      {
        id: 'pred-2',
        type: 'opportunity',
        title: 'Pico de produtividade previsto',
        description: 'Próxima terça-feira deve ser seu dia mais produtivo',
        confidence: 0.81,
        actionable: true,
        suggestedActions: [
          'Agende tarefas mais difíceis para terça',
          'Proteja esse dia de reuniões'
        ],
        relatedData: { date: '2026-01-14', predicted_score: 92 }
      }
    ];
  }
}
