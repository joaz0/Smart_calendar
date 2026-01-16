import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface FocusSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  plannedDuration: number;
  blockedApps: string[];
  blockedWebsites: string[];
  notificationsBlocked: boolean;
  tasksCompleted: number;
  distractionsBlocked: number;
  completed: boolean;
}

export interface FocusSettings {
  defaultDuration: number;
  autoStartBreak: boolean;
  breakDuration: number;
  blockNotifications: boolean;
  blockApps: boolean;
  blockWebsites: boolean;
  blockedAppsList: string[];
  blockedWebsitesList: string[];
  soundEnabled: boolean;
  reminderInterval: number;
}

export interface FocusStats {
  totalSessions: number;
  totalFocusTime: number;
  averageSessionLength: number;
  distractionsBlocked: number;
  tasksCompleted: number;
  longestStreak: number;
  currentStreak: number;
}

@Injectable({
  providedIn: 'root'
})
export class FocusModeService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/focus`;
  
  private isActiveSubject = new BehaviorSubject<boolean>(false);
  private currentSessionSubject = new BehaviorSubject<FocusSession | null>(null);
  private timeRemainingSubject = new BehaviorSubject<number>(0);
  private settingsSubject = new BehaviorSubject<FocusSettings>(this.getDefaultSettings());
  
  public isActive$ = this.isActiveSubject.asObservable();
  public currentSession$ = this.currentSessionSubject.asObservable();
  public timeRemaining$ = this.timeRemainingSubject.asObservable();
  public settings$ = this.settingsSubject.asObservable();
  
  private timerSubscription: any;

  constructor() {
    this.loadSettings();
  }

  startFocusSession(duration: number, settings?: Partial<FocusSettings>): Observable<FocusSession> {
    const session: FocusSession = {
      id: `session-${Date.now()}`,
      startTime: new Date(),
      duration: 0,
      plannedDuration: duration,
      blockedApps: settings?.blockedAppsList || this.settingsSubject.value.blockedAppsList,
      blockedWebsites: settings?.blockedWebsitesList || this.settingsSubject.value.blockedWebsitesList,
      notificationsBlocked: settings?.blockNotifications ?? this.settingsSubject.value.blockNotifications,
      tasksCompleted: 0,
      distractionsBlocked: 0,
      completed: false
    };

    return this.http.post<FocusSession>(`${this.apiUrl}/sessions`, session).pipe(
      tap(savedSession => {
        this.currentSessionSubject.next(savedSession);
        this.isActiveSubject.next(true);
        this.timeRemainingSubject.next(duration * 60);
        this.startTimer(duration * 60);
      }),
      catchError(() => {
        this.currentSessionSubject.next(session);
        this.isActiveSubject.next(true);
        this.timeRemainingSubject.next(duration * 60);
        this.startTimer(duration * 60);
        return of(session);
      })
    );
  }

  endFocusSession(): Observable<FocusSession> {
    const session = this.currentSessionSubject.value;
    if (!session) {
      return of(null as any);
    }

    this.stopTimer();
    
    const endedSession: FocusSession = {
      ...session,
      endTime: new Date(),
      duration: Math.floor((new Date().getTime() - session.startTime.getTime()) / 1000 / 60),
      completed: true
    };

    return this.http.put<FocusSession>(`${this.apiUrl}/sessions/${session.id}`, endedSession).pipe(
      tap(() => {
        this.currentSessionSubject.next(null);
        this.isActiveSubject.next(false);
        this.timeRemainingSubject.next(0);
      }),
      catchError(() => {
        this.currentSessionSubject.next(null);
        this.isActiveSubject.next(false);
        this.timeRemainingSubject.next(0);
        return of(endedSession);
      })
    );
  }

  pauseFocusSession(): void {
    this.stopTimer();
    this.isActiveSubject.next(false);
  }

  resumeFocusSession(): void {
    const timeRemaining = this.timeRemainingSubject.value;
    if (timeRemaining > 0) {
      this.isActiveSubject.next(true);
      this.startTimer(timeRemaining);
    }
  }

  private startTimer(seconds: number): void {
    this.stopTimer();
    let remaining = seconds;
    
    this.timerSubscription = interval(1000).subscribe(() => {
      remaining--;
      this.timeRemainingSubject.next(remaining);
      
      if (remaining <= 0) {
        this.onTimerComplete();
      }
    });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  private onTimerComplete(): void {
    const session = this.currentSessionSubject.value;
    if (session) {
      this.endFocusSession().subscribe();
    }
    
    if (this.settingsSubject.value.soundEnabled) {
      this.playCompletionSound();
    }
  }

  private playCompletionSound(): void {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuByO7bfS4FMo/R8LhlHgU2jdLxy3ElBjCJ0fDJcSYGLIjO8ctzKAYvhsnu1n0tBTCHz+3aeC4GMIbM79p+MAUvhs/t3IAwBjGEy+3efi4FMIbN7Nx+LgUxhszu4oExBjGCye3igjEGMYLL7eGDMQYxgcrt4oQxBjGByu3ihTEGMYHK7eSFMQYxgMnu5IYyBjKAye3khjIGMYDJ7uWHMQYxf8nu5YcyBjGAye7lhzEGMX/I7uaIMgYxf8ju54gyBjF/x+7nqTIGMX7H7uiqMwYyfsfv');
    audio.play().catch(() => console.log('Sound playback failed'));
  }

  recordDistraction(): void {
    const session = this.currentSessionSubject.value;
    if (session) {
      session.distractionsBlocked++;
      this.currentSessionSubject.next(session);
    }
  }

  recordTaskCompletion(): void {
    const session = this.currentSessionSubject.value;
    if (session) {
      session.tasksCompleted++;
      this.currentSessionSubject.next(session);
    }
  }

  getStats(): Observable<FocusStats> {
    return this.http.get<FocusStats>(`${this.apiUrl}/stats`).pipe(
      catchError(() => of(this.getMockStats()))
    );
  }

  getSessions(limit = 10): Observable<FocusSession[]> {
    return this.http.get<FocusSession[]>(`${this.apiUrl}/sessions?limit=${limit}`).pipe(
      catchError(() => of(this.getMockSessions()))
    );
  }

  loadSettings(): void {
    this.http.get<FocusSettings>(`${this.apiUrl}/settings`).pipe(
      catchError(() => of(this.getDefaultSettings()))
    ).subscribe(settings => {
      this.settingsSubject.next(settings);
    });
  }

  updateSettings(settings: Partial<FocusSettings>): Observable<FocusSettings> {
    const updated = { ...this.settingsSubject.value, ...settings };
    return this.http.put<FocusSettings>(`${this.apiUrl}/settings`, updated).pipe(
      tap(result => this.settingsSubject.next(result)),
      catchError(() => {
        this.settingsSubject.next(updated);
        return of(updated);
      })
    );
  }

  private getDefaultSettings(): FocusSettings {
    return {
      defaultDuration: 25,
      autoStartBreak: true,
      breakDuration: 5,
      blockNotifications: true,
      blockApps: false,
      blockWebsites: false,
      blockedAppsList: ['Facebook', 'Twitter', 'Instagram', 'YouTube'],
      blockedWebsitesList: ['facebook.com', 'twitter.com', 'instagram.com', 'youtube.com'],
      soundEnabled: true,
      reminderInterval: 10
    };
  }

  private getMockStats(): FocusStats {
    return {
      totalSessions: 45,
      totalFocusTime: 1125,
      averageSessionLength: 25,
      distractionsBlocked: 234,
      tasksCompleted: 67,
      longestStreak: 7,
      currentStreak: 3
    };
  }

  private getMockSessions(): FocusSession[] {
    return Array.from({ length: 5 }, (_, i) => {
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - i);
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 25);
      
      return {
        id: `session-${i}`,
        startTime,
        endTime,
        duration: 25,
        plannedDuration: 25,
        blockedApps: ['Facebook', 'Twitter'],
        blockedWebsites: ['facebook.com'],
        notificationsBlocked: true,
        tasksCompleted: Math.floor(Math.random() * 5) + 1,
        distractionsBlocked: Math.floor(Math.random() * 10) + 2,
        completed: true
      };
    });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
