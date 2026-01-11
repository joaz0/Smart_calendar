import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface VideoCallLink {
  id: string;
  provider: 'zoom' | 'meet' | 'teams' | 'custom';
  url: string;
  meetingId: string;
  passcode?: string;
  startTime?: Date;
  duration?: number;
}

export interface VideoCallSettings {
  defaultProvider: 'zoom' | 'meet' | 'teams';
  autoGenerateLinks: boolean;
  defaultDuration: number;
  waitingRoom: boolean;
  recording: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VideoCallIntegrationService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/integrations/video`;

  constructor(private http: HttpClient) {}

  createMeeting(provider: string, settings: any): Observable<VideoCallLink> {
    return this.http.post<VideoCallLink>(`${this.apiUrl}/create`, { provider, settings }).pipe(
      catchError(() => of(this.getMockVideoCallLink(provider as any)))
    );
  }

  getMeetingDetails(meetingId: string): Observable<VideoCallLink> {
    return this.http.get<VideoCallLink>(`${this.apiUrl}/meetings/${meetingId}`).pipe(
      catchError(() => of(this.getMockVideoCallLink('meet')))
    );
  }

  updateMeeting(meetingId: string, updates: Partial<VideoCallLink>): Observable<VideoCallLink> {
    return this.http.patch<VideoCallLink>(`${this.apiUrl}/meetings/${meetingId}`, updates).pipe(
      catchError(() => of(this.getMockVideoCallLink('meet')))
    );
  }

  deleteMeeting(meetingId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/meetings/${meetingId}`).pipe(
      catchError(() => of(undefined))
    );
  }

  getSettings(): Observable<VideoCallSettings> {
    return this.http.get<VideoCallSettings>(`${this.apiUrl}/settings`).pipe(
      catchError(() => of(this.getMockSettings()))
    );
  }

  updateSettings(settings: Partial<VideoCallSettings>): Observable<VideoCallSettings> {
    return this.http.patch<VideoCallSettings>(`${this.apiUrl}/settings`, settings).pipe(
      catchError(() => of(this.getMockSettings()))
    );
  }

  testConnection(provider: string): Observable<{ connected: boolean; message: string }> {
    return this.http.post<any>(`${this.apiUrl}/test`, { provider }).pipe(
      catchError(() => of({ connected: false, message: 'Não conectado' }))
    );
  }

  private getMockVideoCallLink(provider: 'zoom' | 'meet' | 'teams' | 'custom'): VideoCallLink {
    const urls = {
      zoom: 'https://zoom.us/j/1234567890',
      meet: 'https://meet.google.com/abc-defg-hij',
      teams: 'https://teams.microsoft.com/l/meetup-join/...',
      custom: 'https://custom-meet.example.com/meeting/123'
    };

    return {
      id: `meeting-${Date.now()}`,
      provider,
      url: urls[provider],
      meetingId: '1234567890',
      passcode: '123456',
      startTime: new Date(),
      duration: 60
    };
  }

  private getMockSettings(): VideoCallSettings {
    return {
      defaultProvider: 'meet',
      autoGenerateLinks: true,
      defaultDuration: 60,
      waitingRoom: false,
      recording: false
    };
  }
}
