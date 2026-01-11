import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface EnergyLevel {
  timestamp: Date;
  level: number;
  mood?: 'energized' | 'focused' | 'tired' | 'stressed' | 'neutral';
  activities: string[];
}

export interface EnergyPattern {
  timeRange: string;
  averageEnergy: number;
  consistency: number;
  factors: string[];
}

export interface EnergyForecast {
  date: Date;
  hourlyForecast: { hour: number; predictedEnergy: number; confidence: number }[];
  recommendations: string[];
}

export interface EnergyInsight {
  type: 'peak' | 'dip' | 'recovery';
  time: string;
  description: string;
  suggestions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EnergyViewService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/energy`;

  constructor(private http: HttpClient) {}

  getEnergyLevels(startDate: Date, endDate: Date): Observable<EnergyLevel[]> {
    return this.http.post<EnergyLevel[]>(`${this.apiUrl}/levels`, { startDate, endDate }).pipe(
      catchError(() => of(this.getMockEnergyLevels()))
    );
  }

  getEnergyPatterns(days: number = 30): Observable<EnergyPattern[]> {
    return this.http.post<EnergyPattern[]>(`${this.apiUrl}/patterns`, { days }).pipe(
      catchError(() => of(this.getMockEnergyPatterns()))
    );
  }

  getForecast(date: Date): Observable<EnergyForecast> {
    return this.http.post<EnergyForecast>(`${this.apiUrl}/forecast`, { date }).pipe(
      catchError(() => of(this.getMockForecast(date)))
    );
  }

  getInsights(): Observable<EnergyInsight[]> {
    return this.http.get<EnergyInsight[]>(`${this.apiUrl}/insights`).pipe(
      catchError(() => of(this.getMockInsights()))
    );
  }

  logEnergyLevel(level: number, mood?: string, activities?: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/log`, { level, mood, activities, timestamp: new Date() }).pipe(
      catchError(() => of(undefined))
    );
  }

  getOptimalScheduling(): Observable<{ activity: string; optimalTime: string; reason: string }[]> {
    return this.http.get<any[]>(`${this.apiUrl}/optimal-scheduling`).pipe(
      catchError(() => of(this.getMockOptimalScheduling()))
    );
  }

  private getMockEnergyLevels(): EnergyLevel[] {
    const levels: EnergyLevel[] = [];
    const now = new Date();
    
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now);
      timestamp.setHours(i, 0, 0, 0);
      
      let level = 50;
      let mood: any = 'neutral';
      
      if (i >= 7 && i <= 11) {
        level = 80 + Math.random() * 15;
        mood = 'energized';
      } else if (i >= 14 && i <= 17) {
        level = 65 + Math.random() * 15;
        mood = 'focused';
      } else if (i >= 13 && i <= 14) {
        level = 40 + Math.random() * 10;
        mood = 'tired';
      } else if (i >= 22 || i <= 6) {
        level = 20 + Math.random() * 15;
        mood = 'tired';
      }
      
      levels.push({
        timestamp,
        level: Math.round(level),
        mood,
        activities: []
      });
    }
    
    return levels;
  }

  private getMockEnergyPatterns(): EnergyPattern[] {
    return [
      {
        timeRange: '07:00-11:00',
        averageEnergy: 85,
        consistency: 0.92,
        factors: ['Sono adequado', 'Café da manhã', 'Baixo estresse']
      },
      {
        timeRange: '11:00-13:00',
        averageEnergy: 70,
        consistency: 0.78,
        factors: ['Pré-almoço', 'Fome crescente']
      },
      {
        timeRange: '13:00-14:00',
        averageEnergy: 45,
        consistency: 0.95,
        factors: ['Pós-almoço', 'Digestão', 'Queda natural']
      },
      {
        timeRange: '14:00-17:00',
        averageEnergy: 68,
        consistency: 0.73,
        factors: ['Recuperação pós-almoço', 'Segunda onda de energia']
      },
      {
        timeRange: '17:00-22:00',
        averageEnergy: 55,
        consistency: 0.65,
        factors: ['Fim do dia', 'Cansaço acumulado']
      }
    ];
  }

  private getMockForecast(date: Date): EnergyForecast {
    const hourlyForecast = [];
    
    for (let hour = 0; hour < 24; hour++) {
      let predictedEnergy = 50;
      let confidence = 0.7;
      
      if (hour >= 8 && hour <= 11) {
        predictedEnergy = 85;
        confidence = 0.9;
      } else if (hour >= 14 && hour <= 17) {
        predictedEnergy = 70;
        confidence = 0.8;
      } else if (hour >= 13 && hour <= 14) {
        predictedEnergy = 45;
        confidence = 0.95;
      } else if (hour >= 22 || hour <= 6) {
        predictedEnergy = 25;
        confidence = 0.92;
      }
      
      hourlyForecast.push({ hour, predictedEnergy, confidence });
    }
    
    return {
      date,
      hourlyForecast,
      recommendations: [
        'Agende tarefas complexas entre 9h-11h',
        'Evite reuniões importantes entre 13h-14h',
        'Use período 14h-17h para colaboração',
        'Reserve período pós 17h para tarefas administrativas'
      ]
    };
  }

  private getMockInsights(): EnergyInsight[] {
    return [
      {
        type: 'peak',
        time: '09:00-11:00',
        description: 'Seu pico de energia ocorre nas manhãs',
        suggestions: [
          'Agende trabalho profundo neste período',
          'Evite reuniões rotineiras',
          'Proteja esse tempo'
        ]
      },
      {
        type: 'dip',
        time: '13:00-14:00',
        description: 'Queda natural de energia pós-almoço',
        suggestions: [
          'Faça uma pausa ativa de 15 minutos',
          'Evite decisões importantes',
          'Tarefas leves ou administrativas'
        ]
      },
      {
        type: 'recovery',
        time: '14:30-17:00',
        description: 'Recuperação de energia à tarde',
        suggestions: [
          'Bom período para reuniões',
          'Trabalho colaborativo',
          'Revisão e comunicação'
        ]
      }
    ];
  }

  private getMockOptimalScheduling(): { activity: string; optimalTime: string; reason: string }[] {
    return [
      {
        activity: 'Programação complexa',
        optimalTime: '09:00-11:00',
        reason: 'Pico de energia e foco'
      },
      {
        activity: 'Reuniões de brainstorm',
        optimalTime: '10:00-12:00',
        reason: 'Alta criatividade e energia'
      },
      {
        activity: 'Tarefas administrativas',
        optimalTime: '13:30-14:30',
        reason: 'Baixa energia - tarefas simples'
      },
      {
        activity: 'Reuniões 1:1',
        optimalTime: '15:00-17:00',
        reason: 'Energia recuperada, boa para comunicação'
      },
      {
        activity: 'Planejamento do dia seguinte',
        optimalTime: '17:00-17:30',
        reason: 'Fechamento do dia, reflexão'
      }
    ];
  }
}
