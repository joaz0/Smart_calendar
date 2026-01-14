import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface HealthData {
  steps: number;
  sleepHours: number;
  heartRate?: number;
  calories?: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HealthIntegrationService {
  private healthDataSubject = new BehaviorSubject<HealthData | null>(null);
  healthData$ = this.healthDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Google Fit
  connectGoogleFit(): void {
    const params = new URLSearchParams({
      client_id: environment.googleClientId,
      redirect_uri: `${environment.oauthRedirectUri}/health`,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.sleep.read',
      access_type: 'offline'
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  handleGoogleFitCallback(code: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/integrations/googlefit/callback`, { code });
  }

  syncGoogleFit(): Observable<HealthData> {
    return this.http.post<HealthData>(`${environment.apiUrl}/integrations/googlefit/sync`, {});
  }

  // Apple Health (via HealthKit Web API)
  connectAppleHealth(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/integrations/applehealth/connect`, {});
  }

  syncAppleHealth(): Observable<HealthData> {
    return this.http.post<HealthData>(`${environment.apiUrl}/integrations/applehealth/sync`, {});
  }

  // Generic
  getHealthData(startDate: Date, endDate: Date): Observable<HealthData[]> {
    return this.http.get<HealthData[]>(`${environment.apiUrl}/integrations/health/data`, {
      params: { start: startDate.toISOString(), end: endDate.toISOString() }
    });
  }

  disconnectProvider(provider: 'googlefit' | 'applehealth'): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/integrations/${provider}`);
  }

  getConnectionStatus(): Observable<{ googleFit: boolean; appleHealth: boolean }> {
    return this.http.get<any>(`${environment.apiUrl}/integrations/health/status`);
  }
}
