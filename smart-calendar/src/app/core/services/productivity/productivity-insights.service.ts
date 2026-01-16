import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface ProductivityPattern {
  type: 'peak' | 'low' | 'consistent';
  timeRange: string;
  description: string;
  score: number;
}

export interface WorkSession {
  date: Date;
  duration: number;
  focusScore: number;
  tasksCompleted: number;
  distractions: number;
}

export interface ProductivityInsight {
  category: 'time' | 'focus' | 'energy' | 'habits';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  icon: string;
}

export interface ProductivityMetricsData {
  userId: string;
  period: { start: Date; end: Date };
  overallScore: number;
  patterns: ProductivityPattern[];
  sessions: WorkSession[];
  insights: ProductivityInsight[];
  weeklyComparison: {
    week: string;
    score: number;
    tasksCompleted: number;
    focusHours: number;
  }[];
  bestHours: string[];
  worstHours: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductivityInsightsService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/productivity`;

  getProductivityInsights(startDate: Date, endDate: Date): Observable<ProductivityMetricsData> {
    const params = new HttpParams()
      .set('start', startDate.toISOString())
      .set('end', endDate.toISOString());

    return this.http.get<any>(`${this.apiUrl}/insights`, { params }).pipe(
      map(data => this.transformBackendData(data, startDate, endDate)),
      catchError(() => of(this.getMockData(startDate, endDate)))
    );
  }

  getProductivityScore(date: Date): Observable<number> {
    const params = new HttpParams().set('date', date.toISOString());
    return this.http.get<any>(`${this.apiUrl}/score`, { params }).pipe(
      map(response => response.score || 75),
      catchError(() => of(75))
    );
  }

  getWorkPatterns(days = 30): Observable<ProductivityPattern[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<any>(`${this.apiUrl}/patterns`, { params }).pipe(
      map(response => response.patterns || []),
      catchError(() => of(this.getMockPatterns()))
    );
  }

  private transformBackendData(data: any, startDate: Date, endDate: Date): ProductivityMetricsData {
    return {
      userId: data.userId || 'current-user',
      period: { start: startDate, end: endDate },
      overallScore: data.overallScore || 75,
      patterns: data.patterns || this.getMockPatterns(),
      sessions: data.sessions || this.getMockSessions(),
      insights: data.insights || this.getMockInsights(),
      weeklyComparison: data.weeklyComparison || this.getMockWeeklyComparison(),
      bestHours: data.bestHours || ['09:00-12:00', '14:00-16:00'],
      worstHours: data.worstHours || ['13:00-14:00', '17:00-18:00']
    };
  }

  private getMockData(startDate: Date, endDate: Date): ProductivityMetricsData {
    return {
      userId: 'mock-user',
      period: { start: startDate, end: endDate },
      overallScore: 78,
      patterns: this.getMockPatterns(),
      sessions: this.getMockSessions(),
      insights: this.getMockInsights(),
      weeklyComparison: this.getMockWeeklyComparison(),
      bestHours: ['09:00-12:00', '14:00-16:00'],
      worstHours: ['13:00-14:00', '17:00-18:00']
    };
  }

  private getMockPatterns(): ProductivityPattern[] {
    return [
      {
        type: 'peak',
        timeRange: '09:00-12:00',
        description: 'Seu pico de produtividade ocorre nas manhãs',
        score: 92
      },
      {
        type: 'low',
        timeRange: '13:00-14:00',
        description: 'Queda de energia após o almoço',
        score: 45
      },
      {
        type: 'consistent',
        timeRange: '14:00-17:00',
        description: 'Produtividade estável nas tardes',
        score: 68
      }
    ];
  }

  private getMockSessions(): WorkSession[] {
    return Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date,
        duration: Math.floor(Math.random() * 4) + 4,
        focusScore: Math.floor(Math.random() * 40) + 60,
        tasksCompleted: Math.floor(Math.random() * 10) + 5,
        distractions: Math.floor(Math.random() * 8) + 2
      };
    });
  }

  private getMockInsights(): ProductivityInsight[] {
    return [
      {
        category: 'time',
        title: 'Horário de Pico',
        description: 'Você é 45% mais produtivo entre 9h-12h',
        impact: 'high',
        recommendation: 'Agende tarefas críticas nas manhãs',
        icon: 'schedule'
      },
      {
        category: 'focus',
        title: 'Distrações Reduzidas',
        description: 'Suas distrações caíram 23% esta semana',
        impact: 'high',
        recommendation: 'Continue usando o modo foco',
        icon: 'center_focus_strong'
      },
      {
        category: 'energy',
        title: 'Queda Pós-Almoço',
        description: 'Energia cai 35% entre 13h-14h',
        impact: 'medium',
        recommendation: 'Faça uma pausa ativa após o almoço',
        icon: 'battery_alert'
      },
      {
        category: 'habits',
        title: 'Consistência Melhorada',
        description: 'Você manteve 5 dias consecutivos de alta produtividade',
        impact: 'high',
        recommendation: 'Mantenha sua rotina atual',
        icon: 'trending_up'
      }
    ];
  }

  private getMockWeeklyComparison(): unknown[] {
    return [
      { week: 'Semana 1', score: 65, tasksCompleted: 18, focusHours: 22 },
      { week: 'Semana 2', score: 72, tasksCompleted: 24, focusHours: 28 },
      { week: 'Semana 3', score: 75, tasksCompleted: 26, focusHours: 30 },
      { week: 'Semana 4', score: 78, tasksCompleted: 29, focusHours: 32 }
    ];
  }
}
