import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


export interface TravelEstimate {
  origin: string;
  destination: string;
  estimatedDuration: number;
  distance: number;
  mode: 'driving' | 'walking' | 'transit' | 'cycling';
  confidence: number;
  trafficFactor?: number;
}

export interface RouteOptimization {
  locations: string[];
  optimizedOrder: string[];
  totalDuration: number;
  totalDistance: number;
  savings: { time: number; distance: number };
}

export interface TrafficPrediction {
  location: string;
  timeSlot: Date;
  predictedTraffic: 'light' | 'moderate' | 'heavy';
  confidence: number;
  recommendation: string;
}

@Injectable({
  providedIn: 'root'
})
export class TravelTimeAiService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/ai/travel`;

  estimateTravelTime(origin: string, destination: string, mode = 'driving', departureTime?: Date): Observable<TravelEstimate> {
    return this.http.post<TravelEstimate>(`${this.apiUrl}/estimate`, {
      origin,
      destination,
      mode,
      departureTime
    }).pipe(
      catchError(() => of(this.getMockEstimate(origin, destination, mode as any)))
    );
  }

  optimizeRoute(locations: string[]): Observable<RouteOptimization> {
    return this.http.post<RouteOptimization>(`${this.apiUrl}/optimize`, { locations }).pipe(
      catchError(() => of(this.getMockOptimization(locations)))
    );
  }

  predictTraffic(location: string, timeSlot: Date): Observable<TrafficPrediction> {
    return this.http.post<TrafficPrediction>(`${this.apiUrl}/traffic`, { location, timeSlot }).pipe(
      catchError(() => of(this.getMockTrafficPrediction(location, timeSlot)))
    );
  }

  suggestDepartureTime(origin: string, destination: string, arrivalTime: Date): Observable<{ departureTime: Date; buffer: number }> {
    return this.http.post<any>(`${this.apiUrl}/departure`, {
      origin,
      destination,
      arrivalTime
    }).pipe(
      catchError(() => {
        const departure = new Date(arrivalTime.getTime() - 30 * 60 * 1000);
        return of({ departureTime: departure, buffer: 10 });
      })
    );
  }

  getAlternativeRoutes(origin: string, destination: string, departureTime: Date): Observable<TravelEstimate[]> {
    return this.http.post<TravelEstimate[]>(`${this.apiUrl}/alternatives`, {
      origin,
      destination,
      departureTime
    }).pipe(
      catchError(() => of(this.getMockAlternatives(origin, destination)))
    );
  }

  private getMockEstimate(origin: string, destination: string, mode: 'driving' | 'walking' | 'transit' | 'cycling'): TravelEstimate {
    const baseTime = 30;
    const modeMultiplier = { driving: 1, transit: 1.2, cycling: 1.5, walking: 3 };
    
    return {
      origin,
      destination,
      estimatedDuration: baseTime * modeMultiplier[mode],
      distance: 15,
      mode,
      confidence: 0.85,
      trafficFactor: mode === 'driving' ? 1.1 : undefined
    };
  }

  private getMockOptimization(locations: string[]): RouteOptimization {
    return {
      locations,
      optimizedOrder: [...locations].reverse(),
      totalDuration: locations.length * 20,
      totalDistance: locations.length * 10,
      savings: { time: 15, distance: 5 }
    };
  }

  private getMockTrafficPrediction(location: string, timeSlot: Date): TrafficPrediction {
    const hour = timeSlot.getHours();
    let traffic: 'light' | 'moderate' | 'heavy' = 'moderate';
    let recommendation = 'Trânsito normal esperado';

    if (hour >= 7 && hour <= 9) {
      traffic = 'heavy';
      recommendation = 'Horário de pico. Considere sair 20 minutos mais cedo.';
    } else if (hour >= 17 && hour <= 19) {
      traffic = 'heavy';
      recommendation = 'Horário de pico vespertino. Adicione 30% ao tempo de viagem.';
    } else if (hour >= 22 || hour <= 6) {
      traffic = 'light';
      recommendation = 'Trânsito leve esperado. Tempo de viagem reduzido.';
    }

    return {
      location,
      timeSlot,
      predictedTraffic: traffic,
      confidence: 0.8,
      recommendation
    };
  }

  private getMockAlternatives(origin: string, destination: string): TravelEstimate[] {
    return [
      {
        origin,
        destination,
        estimatedDuration: 25,
        distance: 12,
        mode: 'driving',
        confidence: 0.9,
        trafficFactor: 1.05
      },
      {
        origin,
        destination,
        estimatedDuration: 35,
        distance: 10,
        mode: 'transit',
        confidence: 0.85
      },
      {
        origin,
        destination,
        estimatedDuration: 45,
        distance: 13,
        mode: 'cycling',
        confidence: 0.8
      }
    ];
  }
}
