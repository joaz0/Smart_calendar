import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { ApiMapperService } from './api-mapper.service';
import { OAuthService } from './oauth.service';

interface AuthResponse {
  token: string;
  user: User;
}

interface PasswordResetResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient, private oauthService: OAuthService) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');
    
    if (token && loginTime) {
      const loginDate = new Date(parseInt(loginTime));
      const now = new Date();
      const daysDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff < 10) {
        this.tokenSubject.next(token);
        this.loadCurrentUser().subscribe();
      } else {
        this.logout();
      }
    }
  }

  // optional mapper injected later by initializer if available
  mapper?: ApiMapperService;

  setMapper(mapper: ApiMapperService) {
    this.mapper = mapper;
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          this.saveAuthData(response.token);
          this.tokenSubject.next(response.token);
          this.currentUserSubject.next(response.user);
        }),
        map((response) => response.user),
        catchError((error) => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  register(user: Partial<User>): Observable<User> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, user).pipe(
      tap((response) => {
        this.saveAuthData(response.token);
        this.tokenSubject.next(response.token);
        this.currentUserSubject.next(response.user);
      }),
      map((response) => response.user),
      catchError((error) => {
        console.error('Register error:', error);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  private saveAuthData(token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('loginTime', Date.now().toString());
  }

  // (removed older void-returning implementations; see richer PasswordResetResponse methods below)

  private loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/me`).pipe(
      tap((user) => this.currentUserSubject.next(user)),
      catchError((error) => {
        console.error('Erro ao carregar usuário:', error);
        this.logout();
        return of(null as any);
      })
    );
  }

  // OAuth login methods
  loginWithOAuth(provider: string, userData: any): Observable<User> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/oauth/${provider}`, userData).pipe(
      tap((response) => {
        this.saveAuthData(response.token);
        this.tokenSubject.next(response.token);
        this.currentUserSubject.next(response.user);
      }),
      map((response) => response.user),
      catchError((error) => {
        console.error(`${provider} OAuth error:`, error);
        throw error;
      })
    );
  }

  isAuthenticated$(): Observable<boolean> {
    return this.token$.pipe(map((token) => !!token && this.isTokenValid()));
  }

  private isTokenValid(): boolean {
    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) return false;
    
    const loginDate = new Date(parseInt(loginTime));
    const now = new Date();
    const daysDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysDiff < 10;
  }

  getRemainingDays(): number {
    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) return 0;
    
    const loginDate = new Date(parseInt(loginTime));
    const now = new Date();
    const daysDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return Math.max(0, Math.ceil(10 - daysDiff));
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  updateUser(user: Partial<User>): Observable<User> {
    const payload = this.mapper ? { ...user, preferences: user.preferences } : user;
    return this.http
      .patch<User>(`${environment.apiUrl}/auth/profile`, payload)
      .pipe(tap((updatedUser) => this.currentUserSubject.next(updatedUser)));
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/change-password`, {
      oldPassword,
      newPassword,
    });
  }
  // Password reset endpoints returning a richer response
  forgotPassword(email: string): Observable<PasswordResetResponse> {
    return this.http.post<PasswordResetResponse>(`${environment.apiUrl}/auth/forgot-password`, {
      email,
    });
  }

  resetPassword(token: string, newPassword: string): Observable<PasswordResetResponse> {
    return this.http.post<PasswordResetResponse>(`${environment.apiUrl}/auth/reset-password`, {
      token,
      newPassword,
    });
  }

  validateResetToken(token: string): Observable<PasswordResetResponse> {
    return this.http.post<PasswordResetResponse>(
      `${environment.apiUrl}/auth/validate-reset-token`,
      { token }
    );
  }

  loginWithGoogle(): Observable<User> {
    return this.oauthService.loginWithGoogle().pipe(
      switchMap((googleResponse) => {
        return this.loginWithOAuth('google', googleResponse);
      })
    );
  }

  loginWithMicrosoft(): Observable<User> {
    return this.oauthService.loginWithMicrosoft().pipe(
      switchMap((microsoftResponse) => {
        return this.loginWithOAuth('microsoft', microsoftResponse);
      })
    );
  }
}
