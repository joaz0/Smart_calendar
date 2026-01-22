import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


export interface PomodoroSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  type: 'work' | 'shortBreak' | 'longBreak';
  duration: number;
  completed: boolean;
  interrupted: boolean;
  taskId?: string;
  taskTitle?: string;
}

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface PomodoroStats {
  totalSessions: number;
  completedSessions: number;
  totalWorkTime: number;
  totalBreakTime: number;
  averageSessionLength: number;
  todaySessions: number;
  currentStreak: number;
  longestStreak: number;
}

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/pomodoro`;
  
  private isActiveSubject = new BehaviorSubject<boolean>(false);
  private currentSessionSubject = new BehaviorSubject<PomodoroSession | null>(null);
  private timeRemainingSubject = new BehaviorSubject<number>(0);
  private sessionsCompletedSubject = new BehaviorSubject<number>(0);
  private settingsSubject = new BehaviorSubject<PomodoroSettings>(this.getDefaultSettings());
  
  public isActive$ = this.isActiveSubject.asObservable();
  public currentSession$ = this.currentSessionSubject.asObservable();
  public timeRemaining$ = this.timeRemainingSubject.asObservable();
  public sessionsCompleted$ = this.sessionsCompletedSubject.asObservable();
  public settings$ = this.settingsSubject.asObservable();
  
  private timerSubscription: Subscription | null = null;
  private sessionCount = 0;

  constructor() {
    this.loadSettings();
  }

  startSession(type: 'work' | 'shortBreak' | 'longBreak', taskId?: string, taskTitle?: string): Observable<PomodoroSession> {
    const settings = this.settingsSubject.value;
    let duration: number;
    
    switch (type) {
      case 'work':
        duration = settings.workDuration;
        break;
      case 'shortBreak':
        duration = settings.shortBreakDuration;
        break;
      case 'longBreak':
        duration = settings.longBreakDuration;
        break;
    }

    const session: PomodoroSession = {
      id: `pomodoro-${Date.now()}`,
      startTime: new Date(),
      type,
      duration,
      completed: false,
      interrupted: false,
      taskId,
      taskTitle
    };

    return this.http.post<PomodoroSession>(`${this.apiUrl}/sessions`, session).pipe(
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

  startWorkSession(taskId?: string, taskTitle?: string): Observable<PomodoroSession> {
    return this.startSession('work', taskId, taskTitle);
  }

  startBreak(): Observable<PomodoroSession> {
    const sessionsCompleted = this.sessionsCompletedSubject.value;
    const settings = this.settingsSubject.value;
    const type = (sessionsCompleted % settings.sessionsBeforeLongBreak === 0) ? 'longBreak' : 'shortBreak';
    return this.startSession(type);
  }

  completeSession(): Observable<PomodoroSession | null> {
    const session = this.currentSessionSubject.value;
    if (!session) {
      return of(null);
    }

    this.stopTimer();
    
    const completedSession: PomodoroSession = {
      ...session,
      endTime: new Date(),
      completed: true
    };

    if (session.type === 'work') {
      this.sessionCount++;
      this.sessionsCompletedSubject.next(this.sessionCount);
    }

    return this.http.put<PomodoroSession>(`${this.apiUrl}/sessions/${session.id}`, completedSession).pipe(
      tap(() => {
        this.currentSessionSubject.next(null);
        this.isActiveSubject.next(false);
        this.timeRemainingSubject.next(0);
        
        if (this.settingsSubject.value.soundEnabled) {
          this.playCompletionSound();
        }
        
        this.handleAutoStart(session);
      }),
      catchError(() => {
        this.currentSessionSubject.next(null);
        this.isActiveSubject.next(false);
        this.timeRemainingSubject.next(0);
        return of(completedSession);
      })
    );
  }

  interruptSession(): Observable<PomodoroSession | null> {
    const session = this.currentSessionSubject.value;
    if (!session) {
      return of(null);
    }

    this.stopTimer();
    
    const interruptedSession: PomodoroSession = {
      ...session,
      endTime: new Date(),
      interrupted: true
    };

    return this.http.put<PomodoroSession>(`${this.apiUrl}/sessions/${session.id}`, interruptedSession).pipe(
      tap(() => {
        this.currentSessionSubject.next(null);
        this.isActiveSubject.next(false);
        this.timeRemainingSubject.next(0);
      }),
      catchError(() => {
        this.currentSessionSubject.next(null);
        this.isActiveSubject.next(false);
        this.timeRemainingSubject.next(0);
        return of(interruptedSession);
      })
    );
  }

  private startTimer(seconds: number): void {
    this.stopTimer();
    let remaining = seconds;
    
    this.timerSubscription = interval(1000).subscribe(() => {
      remaining--;
      this.timeRemainingSubject.next(remaining);
      
      if (remaining <= 0) {
        this.completeSession().subscribe();
      }
    });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  private handleAutoStart(completedSession: PomodoroSession): void {
    const settings = this.settingsSubject.value;
    
    if (completedSession.type === 'work' && settings.autoStartBreaks) {
      setTimeout(() => this.startBreak().subscribe(), 1000);
    } else if (completedSession.type !== 'work' && settings.autoStartPomodoros) {
      setTimeout(() => this.startWorkSession().subscribe(), 1000);
    }
  }

  private playCompletionSound(): void {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuByO7bfS4FMo/R8LhlHgU2jdLxy3ElBjCJ0fDJcSYGLIjO8ctzKAYvhsnu1n0tBTCHz+3aeC4GMIbM79p+MAUvhs/t3IAwBjGEy+3efi4FMIbN7Nx+LgUxhszu4oExBjGCye3igjEGMYLL7eGDMQYxgcrt4oQxBjGByu3ihTEGMYHK7eSFMQYxgMnu5IYyBjKAye3khjIGMYDJ7uWHMQYxf8nu5YcyBjGAye7lhzEGMX/I7uaIMgYxf8ju54gyBjF/x+7nqTIGMX7H7uiqMwYyfsfv');
    audio.play().catch(() => console.log('Sound playback failed'));
  }

  getStats(): Observable<PomodoroStats> {
    return this.http.get<PomodoroStats>(`${this.apiUrl}/stats`).pipe(
      catchError(() => of(this.getMockStats()))
    );
  }

  getSessions(limit = 20): Observable<PomodoroSession[]> {
    return this.http.get<PomodoroSession[]>(`${this.apiUrl}/sessions?limit=${limit}`).pipe(
      catchError(() => of(this.getMockSessions()))
    );
  }

  loadSettings(): void {
    this.http.get<PomodoroSettings>(`${this.apiUrl}/settings`).pipe(
      catchError(() => of(this.getDefaultSettings()))
    ).subscribe(settings => {
      this.settingsSubject.next(settings);
    });
  }

  updateSettings(settings: Partial<PomodoroSettings>): Observable<PomodoroSettings> {
    const updated = { ...this.settingsSubject.value, ...settings };
    return this.http.put<PomodoroSettings>(`${this.apiUrl}/settings`, updated).pipe(
      tap(result => this.settingsSubject.next(result)),
      catchError(() => {
        this.settingsSubject.next(updated);
        return of(updated);
      })
    );
  }

  resetSessionCount(): void {
    this.sessionCount = 0;
    this.sessionsCompletedSubject.next(0);
  }

  private getDefaultSettings(): PomodoroSettings {
    return {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsBeforeLongBreak: 4,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      soundEnabled: true,
      notificationsEnabled: true
    };
  }

  private getMockStats(): PomodoroStats {
    return {
      totalSessions: 142,
      completedSessions: 127,
      totalWorkTime: 3175,
      totalBreakTime: 635,
      averageSessionLength: 25,
      todaySessions: 8,
      currentStreak: 5,
      longestStreak: 12
    };
  }

  private getMockSessions(): PomodoroSession[] {
    const sessions: PomodoroSession[] = [];
    const types: ('work' | 'shortBreak' | 'longBreak')[] = ['work', 'shortBreak'];
    
    for (let i = 0; i < 10; i++) {
      const startTime = new Date();
      startTime.setMinutes(startTime.getMinutes() - (i * 30));
      const type = types[i % 2];
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + (type === 'work' ? 25 : 5));
      
      sessions.push({
        id: `session-${i}`,
        startTime,
        endTime,
        type,
        duration: type === 'work' ? 25 : 5,
        completed: Math.random() > 0.2,
        interrupted: Math.random() > 0.8,
        taskTitle: type === 'work' ? `Tarefa ${i + 1}` : undefined
      });
    }
    
    return sessions;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
