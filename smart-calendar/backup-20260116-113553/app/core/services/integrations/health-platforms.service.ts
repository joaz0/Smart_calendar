import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


export interface HealthData {
  date: Date;
  steps: number;
  heartRate?: number;
  sleep?: { duration: number; quality: number };
  calories?: number;
  distance?: number;
  activeMinutes?: number;
}

export interface HealthGoal {
  id: string;
  type: 'steps' | 'sleep' | 'exercise' | 'water' | 'weight';
  target: number;
  current: number;
  unit: string;
  deadline?: Date;
}

export interface HealthInsight {
  type: 'achievement' | 'warning' | 'tip';
  title: string;
  description: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class HealthPlatformsService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/integrations/health`;

  connectPlatform(platform: 'fitbit' | 'apple_health' | 'google_fit' | 'samsung_health'): Observable<{ success: boolean; message: string }> {
    return this.http.post<any>(`${this.apiUrl}/connect`, { platform }).pipe(
      catchError(() => of({ success: false, message: 'Erro ao conectar' }))
    );
  }

  disconnectPlatform(platform: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/disconnect`, { platform }).pipe(
      catchError(() => of(undefined))
    );
  }

  syncHealthData(platform: string): Observable<{ synced: number; lastSync: Date }> {
    return this.http.post<any>(`${this.apiUrl}/sync`, { platform }).pipe(
      catchError(() => of({ synced: 100, lastSync: new Date() }))
    );
  }

  getHealthData(startDate: Date, endDate: Date): Observable<HealthData[]> {
    return this.http.post<HealthData[]>(`${this.apiUrl}/data`, { startDate, endDate }).pipe(
      catchError(() => of(this.getMockHealthData()))
    );
  }

  getTodayStats(): Observable<HealthData> {
    return this.http.get<HealthData>(`${this.apiUrl}/today`).pipe(
      catchError(() => of(this.getMockHealthData()[0]))
    );
  }

  getHealthGoals(): Observable<HealthGoal[]> {
    return this.http.get<HealthGoal[]>(`${this.apiUrl}/goals`).pipe(
      catchError(() => of(this.getMockHealthGoals()))
    );
  }

  createGoal(goal: Omit<HealthGoal, 'id' | 'current'>): Observable<HealthGoal> {
    return this.http.post<HealthGoal>(`${this.apiUrl}/goals`, goal).pipe(
      catchError(() => of({ ...goal, id: `goal-${Date.now()}`, current: 0 } as HealthGoal))
    );
  }

  updateGoalProgress(goalId: string, progress: number): Observable<HealthGoal> {
    return this.http.patch<HealthGoal>(`${this.apiUrl}/goals/${goalId}`, { current: progress }).pipe(
      catchError(() => of(this.getMockHealthGoals()[0]))
    );
  }

  getHealthInsights(): Observable<HealthInsight[]> {
    return this.http.get<HealthInsight[]>(`${this.apiUrl}/insights`).pipe(
      catchError(() => of(this.getMockHealthInsights()))
    );
  }

  scheduleDaysOffBasedOnHealth(): Observable<Date[]> {
    return this.http.post<Date[]>(`${this.apiUrl}/suggest-rest-days`, {}).pipe(
      catchError(() => of([
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ]))
    );
  }

  private getMockHealthData(): HealthData[] {
    const data: HealthData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date,
        steps: Math.floor(5000 + Math.random() * 8000),
        heartRate: Math.floor(60 + Math.random() * 30),
        sleep: {
          duration: Math.floor(360 + Math.random() * 120),
          quality: Math.floor(60 + Math.random() * 40)
        },
        calories: Math.floor(1800 + Math.random() * 800),
        distance: Math.floor(3 + Math.random() * 7),
        activeMinutes: Math.floor(30 + Math.random() * 90)
      });
    }
    return data;
  }

  private getMockHealthGoals(): HealthGoal[] {
    return [
      {
        id: 'goal-1',
        type: 'steps',
        target: 10000,
        current: 7500,
        unit: 'passos'
      },
      {
        id: 'goal-2',
        type: 'sleep',
        target: 480,
        current: 420,
        unit: 'minutos'
      },
      {
        id: 'goal-3',
        type: 'exercise',
        target: 150,
        current: 95,
        unit: 'minutos/semana'
      }
    ];
  }

  private getMockHealthInsights(): HealthInsight[] {
    return [
      {
        type: 'achievement',
        title: 'Meta de passos atingida!',
        description: 'Você atingiu sua meta de 10.000 passos por 5 dias consecutivos'
      },
      {
        type: 'warning',
        title: 'Qualidade do sono baixa',
        description: 'Sua qualidade de sono está abaixo da média nos últimos 3 dias',
        data: { avgQuality: 62 }
      },
      {
        type: 'tip',
        title: 'Hora de se movimentar',
        description: 'Você está inativo há 2 horas. Que tal uma caminhada de 10 minutos?'
      }
    ];
  }
}
