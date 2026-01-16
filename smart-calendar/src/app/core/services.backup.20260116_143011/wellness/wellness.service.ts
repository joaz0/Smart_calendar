import { Injectable, inject } from '@angular/core.component';
import { HttpClient } from '@angular/common/http.component';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators.component';
import { environment } from '../../../../environments/environment.component';

export interface WellnessMetrics {
  workLifeBalance: number;
  breakFrequency: number;
  overworkHours: number;
  stressLevel: 'low' | 'medium' | 'high';
  sleepQuality: number;
  exerciseMinutes: number;
}

export interface BreakPattern {
  day: string;
  breaksTaken: number;
  avgBreakDuration: number;
  recommended: number;
}

export interface WellnessRecommendation {
  category: 'break' | 'balance' | 'stress' | 'exercise' | 'sleep';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class WellnessService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/wellness`;

  getWellnessMetrics(): Observable<WellnessMetrics> {
    return this.http.get<WellnessMetrics>(`${this.apiUrl}/metrics`).pipe(
      catchError(() => of(this.getMockMetrics()))
    );
  }

  getBreakPatterns(days = 7): Observable<BreakPattern[]> {
    return this.http.get<BreakPattern[]>(`${this.apiUrl}/breaks?days=${days}`).pipe(
      catchError(() => of(this.getMockBreakPatterns()))
    );
  }

  getRecommendations(): Observable<WellnessRecommendation[]> {
    return this.http.get<WellnessRecommendation[]>(`${this.apiUrl}/recommendations`).pipe(
      catchError(() => of(this.getMockRecommendations()))
    );
  }

  private getMockMetrics(): WellnessMetrics {
    return {
      workLifeBalance: 72,
      breakFrequency: 85,
      overworkHours: 5,
      stressLevel: 'medium',
      sleepQuality: 68,
      exerciseMinutes: 180
    };
  }

  private getMockBreakPatterns(): BreakPattern[] {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return days.map(day => ({
      day,
      breaksTaken: Math.floor(Math.random() * 6) + 2,
      avgBreakDuration: Math.floor(Math.random() * 10) + 10,
      recommended: 6
    }));
  }

  private getMockRecommendations(): WellnessRecommendation[] {
    return [
      {
        category: 'break',
        title: 'Aumente a Frequência de Pausas',
        description: 'Você fez apenas 4 pausas hoje. Recomendamos 6-8 pausas curtas.',
        priority: 'high',
        icon: 'coffee'
      },
      {
        category: 'balance',
        title: 'Equilíbrio Trabalho-Vida',
        description: 'Seu equilíbrio está bom, mas pode melhorar reduzindo 1h de trabalho por dia.',
        priority: 'medium',
        icon: 'balance'
      },
      {
        category: 'stress',
        title: 'Nível de Estresse Moderado',
        description: 'Pratique técnicas de respiração ou meditação por 10 minutos.',
        priority: 'medium',
        icon: 'self_improvement'
      },
      {
        category: 'exercise',
        title: 'Meta de Exercício Atingida',
        description: 'Parabéns! Você atingiu 180 minutos de exercício esta semana.',
        priority: 'low',
        icon: 'fitness_center'
      }
    ];
  }
}
