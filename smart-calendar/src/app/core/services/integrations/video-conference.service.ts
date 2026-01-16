import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


export interface MeetingLink {
  provider: 'zoom' | 'meet' | 'teams';
  url: string;
  meetingId: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoConferenceService {
  private http = inject(HttpClient);


  // Zoom
  connectZoom(): void {
    const params = new URLSearchParams({
      client_id: environment.zoomClientId || '',
      redirect_uri: `${environment.oauthRedirectUri}/zoom`,
      response_type: 'code'
    });
    window.location.href = `https://zoom.us/oauth/authorize?${params}`;
  }

  createZoomMeeting(title: string, startTime: Date, duration: number): Observable<MeetingLink> {
    return this.http.post<MeetingLink>(`${environment.apiUrl}/integrations/zoom/meeting`, {
      title, startTime, duration
    });
  }

  // Google Meet
  createGoogleMeet(eventId: string): Observable<MeetingLink> {
    return this.http.post<MeetingLink>(`${environment.apiUrl}/integrations/meet/create`, { eventId });
  }

  // Microsoft Teams
  connectTeams(): void {
    const params = new URLSearchParams({
      client_id: environment.teamsClientId || '',
      redirect_uri: `${environment.oauthRedirectUri}/teams`,
      response_type: 'code',
      scope: 'OnlineMeetings.ReadWrite'
    });
    window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`;
  }

  createTeamsMeeting(title: string, startTime: Date, duration: number): Observable<MeetingLink> {
    return this.http.post<MeetingLink>(`${environment.apiUrl}/integrations/teams/meeting`, {
      title, startTime, duration
    });
  }

  // Generic
  addMeetingToEvent(eventId: string, provider: 'zoom' | 'meet' | 'teams'): Observable<MeetingLink> {
    return this.http.post<MeetingLink>(`${environment.apiUrl}/events/${eventId}/meeting`, { provider });
  }

  getConnectionStatus(): Observable<{ zoom: boolean; meet: boolean; teams: boolean }> {
    return this.http.get<{ zoom: boolean; meet: boolean; teams: boolean }>(`${environment.apiUrl}/integrations/video/status`);
  }

  disconnect(provider: 'zoom' | 'meet' | 'teams'): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/integrations/${provider}`);
  }
}
