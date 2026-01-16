import { Injectable, inject } from '@angular/core.component';
import { HttpClient } from '@angular/common/http.component';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map } from 'rxjs/operators.component';
import { environment } from '../../../../environments/environment.component';
import { calculateBurnoutScore, calculateWellnessScore } from '../../../utils/wellness-calculations.component';


export interface BurnoutData {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    workHours: number;
    breaks: number;
    stress: number;
    sleep: number;
  };
  recommendations: string[];
}

export interface WellnessMetrics {
  score: number;
  sleepHours: number;
  stressLevel: number;
  energyLevel: number;
  exerciseMinutes: number;
  breaksTaken: number;
}

@Injectable({
  providedIn: 'root'
})
export class BurnoutDetectorService {
  private http = inject(HttpClient);

  private burnoutDataSubject = new BehaviorSubject<BurnoutData | null>(null);
  burnoutData$ = this.burnoutDataSubject.asObservable();

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring(): void {
    interval(3600000).subscribe(() => this.checkBurnout());
  }

  checkBurnout(): Observable<BurnoutData> {
    return this.http.get<any>(`${environment.apiUrl}/wellness/burnout`).pipe(
      map(data => {
        const score = calculateBurnoutScore(
          data.workHours || 0,
          data.breaks || 0,
          data.stress || 5,
          data.sleep || 7
        );
        
        const burnoutData: BurnoutData = {
          score,
          level: this.getBurnoutLevel(score),
          factors: data,
          recommendations: this.getRecommendations(score)
        };
        
        this.burnoutDataSubject.next(burnoutData);
        return burnoutData;
      })
    );
  }

  private getBurnoutLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score < 25) return 'low';
    if (score < 50) return 'medium';
    if (score < 75) return 'high';
    return 'critical';
  }

  private getRecommendations(score: number): string[] {
    if (score < 25) return ['Continue mantendo um bom equilíbrio'];
    if (score < 50) return ['Considere fazer mais pausas', 'Tente dormir mais'];
    if (score < 75) return ['Reduza sua carga de trabalho', 'Agende tempo para descanso'];
    return ['Procure ajuda profissional', 'Tire alguns dias de folga', 'Reavalie suas prioridades'];
  }
}

@Injectable({
  providedIn: 'root'
})
export class WellnessTrackingService {
  private http = inject(HttpClient);

  private metricsSubject = new BehaviorSubject<WellnessMetrics | null>(null);
  metrics$ = this.metricsSubject.asObservable();

  trackMetrics(metrics: Partial<WellnessMetrics>): Observable<WellnessMetrics> {
    return this.http.post<WellnessMetrics>(`${environment.apiUrl}/wellness/metrics`, metrics);
  }

  getMetrics(startDate: Date, endDate: Date): Observable<WellnessMetrics[]> {
    return this.http.get<WellnessMetrics[]>(`${environment.apiUrl}/wellness/metrics`, {
      params: { start: startDate.toISOString(), end: endDate.toISOString() }
    });
  }

  calculateScore(metrics: WellnessMetrics): number {
    return calculateWellnessScore(
      metrics.sleepHours,
      metrics.stressLevel,
      metrics.energyLevel,
      metrics.exerciseMinutes,
      metrics.breaksTaken
    );
  }
}
