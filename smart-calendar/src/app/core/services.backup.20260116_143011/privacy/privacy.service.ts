import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.component';

export interface PrivacySettings {
  dataSharing: boolean;
  analyticsTracking: boolean;
  locationTracking: boolean;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  visibilitySettings: {
    calendar: 'public' | 'private' | 'team';
    tasks: 'public' | 'private' | 'team';
    profile: 'public' | 'private';
  };
}

export interface DataAccessLog {
  id: string;
  timestamp: Date;
  action: 'read' | 'write' | 'delete' | 'share';
  resource: string;
  userId: string;
  ipAddress?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrivacyService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/privacy`;
  private settingsSubject = new BehaviorSubject<PrivacySettings>(this.getDefaultSettings());
  public settings$ = this.settingsSubject.asObservable();

  constructor() {
    this.loadSettings();
  }

  loadSettings(): void {
    this.http.get<PrivacySettings>(`${this.apiUrl}/settings`).pipe(
      catchError(() => of(this.getDefaultSettings()))
    ).subscribe(settings => {
      this.settingsSubject.next(settings);
    });
  }

  updateSettings(settings: Partial<PrivacySettings>): Observable<PrivacySettings> {
    const updated = { ...this.settingsSubject.value, ...settings };
    return this.http.put<PrivacySettings>(`${this.apiUrl}/settings`, updated).pipe(
      tap(result => this.settingsSubject.next(result)),
      catchError(() => {
        this.settingsSubject.next(updated);
        return of(updated);
      })
    );
  }

  getAccessLogs(): Observable<DataAccessLog[]> {
    return this.http.get<DataAccessLog[]>(`${this.apiUrl}/access-logs`).pipe(
      catchError(() => of(this.getMockLogs()))
    );
  }

  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/account`);
  }

  exportData(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, { responseType: 'blob' });
  }

  private getDefaultSettings(): PrivacySettings {
    return {
      dataSharing: false,
      analyticsTracking: true,
      locationTracking: false,
      notificationPreferences: {
        email: true,
        push: true,
        sms: false
      },
      visibilitySettings: {
        calendar: 'private',
        tasks: 'private',
        profile: 'private'
      }
    };
  }

  private getMockLogs(): DataAccessLog[] {
    return [
      {
        id: '1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        action: 'read',
        resource: 'Calendar Events',
        userId: 'user-1',
        ipAddress: '192.168.1.100'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        action: 'write',
        resource: 'Task List',
        userId: 'user-1',
        ipAddress: '192.168.1.100'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        action: 'share',
        resource: 'Project Calendar',
        userId: 'user-1',
        ipAddress: '192.168.1.100'
      }
    ];
  }
}
