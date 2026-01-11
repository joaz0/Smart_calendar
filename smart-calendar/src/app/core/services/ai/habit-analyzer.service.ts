import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completionRate: number;
  streak: number;
  category: string;
  impact: 'high' | 'medium' | 'low';
}

export interface HabitPattern {
  habitId: string;
  pattern: string;
  confidence: number;
  recommendation: string;
}

export interface HabitInsight {
  type: 'strength' | 'weakness' | 'opportunity';
  title: string;
  description: string;
  habits: string[];
}

@Injectable({
  providedIn: 'root'
})
export class HabitAnalyzerService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/ai/habits`;

  constructor(private http: HttpClient) {}

  analyzeHabits(userId: string, period: number = 30): Observable<HabitInsight[]> {
    return this.http.get<HabitInsight[]>(`${this.apiUrl}/analyze/${userId}?days=${period}`).pipe(
      catchError(() => of(this.getMockInsights()))
    );
  }

  detectPatterns(habitId: string): Observable<HabitPattern[]> {
    return this.http.get<HabitPattern[]>(`${this.apiUrl}/patterns/${habitId}`).pipe(
      catchError(() => of(this.getMockPatterns(habitId)))
    );
  }

  predictSuccess(habit: Partial<Habit>): Observable<{ probability: number; factors: string[] }> {
    return this.http.post<any>(`${this.apiUrl}/predict`, habit).pipe(
      catchError(() => of({ probability: 0.75, factors: ['Horário consistente', 'Motivação clara', 'Suporte social'] }))
    );
  }

  suggestHabits(goals: string[]): Observable<Habit[]> {
    return this.http.post<Habit[]>(`${this.apiUrl}/suggest`, { goals }).pipe(
      catchError(() => of(this.getMockSuggestions()))
    );
  }

  private getMockInsights(): HabitInsight[] {
    return [
      {
        type: 'strength',
        title: 'Consistência matinal forte',
        description: 'Você mantém 95% de consistência em hábitos matinais',
        habits: ['exercicio', 'meditacao']
      },
      {
        type: 'weakness',
        title: 'Queda noturna',
        description: 'Hábitos noturnos têm apenas 40% de conclusão',
        habits: ['leitura', 'planejamento']
      },
      {
        type: 'opportunity',
        title: 'Janela de oportunidade',
        description: 'Período entre 14h-15h está livre e pode ser usado para novos hábitos',
        habits: []
      }
    ];
  }

  private getMockPatterns(habitId: string): HabitPattern[] {
    return [
      {
        habitId,
        pattern: 'Segunda-feira tem 30% mais falhas',
        confidence: 0.85,
        recommendation: 'Adicione um lembrete extra nas segundas'
      },
      {
        habitId,
        pattern: 'Após eventos sociais, taxa de sucesso cai 45%',
        confidence: 0.78,
        recommendation: 'Prepare recursos de recuperação para dias pós-social'
      }
    ];
  }

  private getMockSuggestions(): Habit[] {
    return [
      {
        id: '1',
        name: 'Caminhada de 10 minutos',
        frequency: 'daily',
        completionRate: 0,
        streak: 0,
        category: 'Saúde',
        impact: 'high'
      },
      {
        id: '2',
        name: 'Revisar tarefas diárias',
        frequency: 'daily',
        completionRate: 0,
        streak: 0,
        category: 'Produtividade',
        impact: 'medium'
      }
    ];
  }
}
