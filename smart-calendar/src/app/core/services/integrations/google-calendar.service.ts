import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  private http = inject(HttpClient);


  authorize(): void {
    const params = new URLSearchParams({
      client_id: environment.googleClientId,
      redirect_uri: environment.oauthRedirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/calendar',
      access_type: 'offline',
      prompt: 'consent'
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  handleCallback(code: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/integrations/google/callback`, { code });
  }

  syncEvents(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/integrations/google/sync`, {});
  }

  disconnect(): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/integrations/google`);
  }

  getStatus(): Observable<{ connected: boolean; email?: string }> {
    return this.http.get<any>(`${environment.apiUrl}/integrations/google/status`);
  }
}
