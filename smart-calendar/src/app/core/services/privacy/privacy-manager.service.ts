import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';

export enum PrivacyLevel {
  PUBLIC = 'public',
  SHARED = 'shared',
  PRIVATE = 'private',
  CONFIDENTIAL = 'confidential',
  STEALTH = 'stealth'
}

export enum PrivacyContext {
  CALENDAR_EVENTS = 'calendar_events',
  HEALTH_DATA = 'health_data',
  LOCATION_DATA = 'location_data',
  COLLABORATION = 'collaboration',
  PERSONAL_INSIGHTS = 'personal_insights',
  AI_TRAINING = 'ai_training',
  BACKUP_DATA = 'backup_data'
}

@Injectable({
  providedIn: 'root'
})
export class PrivacyManagerService {
  private http = inject(HttpClient);

  private privacySettingsSubject = new BehaviorSubject<any>(null);
  privacySettings$ = this.privacySettingsSubject.asObservable();

  constructor() {
    this.loadPrivacySettings();
  }

  private loadPrivacySettings(): void {
    this.http.get(`${environment.apiUrl}/privacy/settings`).subscribe({
      next: (settings) => this.privacySettingsSubject.next(settings),
      error: () => this.privacySettingsSubject.next(this.getDefaultSettings())
    });
  }

  checkPrivacyAccess(level: PrivacyLevel, context: PrivacyContext): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/privacy/check`, { level, context });
  }

  updatePrivacySettings(settings: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/privacy/settings`, settings);
  }

  private getDefaultSettings(): any {
    return {
      defaultLevel: PrivacyLevel.PRIVATE,
      allowDataCollection: false,
      allowAIFeatures: true,
      encryptionEnabled: true
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private http = inject(HttpClient);

  isDataEncrypted(context: PrivacyContext): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/privacy/encryption/${context}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class OffGridModeService {
  private offGridSubject = new BehaviorSubject<boolean>(false);
  offGrid$ = this.offGridSubject.asObservable();

  isOffGridModeActive(): Observable<boolean> {
    return this.offGrid$;
  }

  toggleOffGrid(enabled: boolean): void {
    this.offGridSubject.next(enabled);
    localStorage.setItem('offGridMode', String(enabled));
  }

  constructor() {
    const saved = localStorage.getItem('offGridMode');
    if (saved) this.offGridSubject.next(saved === 'true');
  }
}

@Injectable({
  providedIn: 'root'
})
export class EventCamouflageService {
  private camouflageEnabledSubject = new BehaviorSubject<boolean>(false);

  isCamouflageEnabled(): Observable<boolean> {
    return this.camouflageEnabledSubject.asObservable();
  }

  toggleCamouflage(enabled: boolean): void {
    this.camouflageEnabledSubject.next(enabled);
  }
}
