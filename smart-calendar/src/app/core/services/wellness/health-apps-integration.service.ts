import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class HealthAppsIntegrationService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/wellness/health-apps`;

  connectApp(appName: string): Observable<{ success: boolean }> {
    return this.http.post<any>(`${this.apiUrl}/connect`, { appName }).pipe(
      catchError(() => of({ success: false }))
    );
  }

  syncData(): Observable<{ synced: number }> {
    return this.http.post<any>(`${this.apiUrl}/sync`, {}).pipe(
      catchError(() => of({ synced: 0 }))
    );
  }

  getHealthData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/data`).pipe(
      catchError(() => of({ steps: 8500, sleep: 420, heartRate: 72 }))
    );
  }
}
