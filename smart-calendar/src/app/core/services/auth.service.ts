import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthApiService } from './auth-api.service';
import { OAuthService } from './oauth.service';
import { Logger } from '../utils/logger';

interface PasswordResetResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authApiService = inject(AuthApiService);
  private oauthService = inject(OAuthService);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  private logger = new Logger('AuthService');

  constructor() {
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

  login(email: string, password: string): Observable<User> {
    this.logger.info('Iniciando login', { email });
    return this.authApiService.login({ email, password }).pipe(
      tap((response) => {
        this.logger.info('Login bem-sucedido');
        this.saveAuthData(response.token);
        this.tokenSubject.next(response.token);
        this.currentUserSubject.next(response.user);
      }),
      map((response) => response.user),
      catchError((error) => {
        this.logger.error('Erro no login', error);
        throw error;
      })
    );
  }

  register(user: Partial<User>): Observable<User> {
    this.logger.info('Iniciando registro', { email: user.email });
    return this.authApiService.register(user as any).pipe(
      tap((response) => {
        this.logger.info('Registro bem-sucedido');
        this.saveAuthData(response.token);
        this.tokenSubject.next(response.token);
        this.currentUserSubject.next(response.user);
      }),
      map((response) => response.user),
      catchError((error) => {
        this.logger.error('Erro no registro', error);
        throw error;
      })
    );
  }

  logout(): void {
    this.logger.info('Logout realizado');
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  private saveAuthData(token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('loginTime', Date.now().toString());
  }

  private loadCurrentUser(): Observable<User> {
    return this.authApiService.getCurrentUser().pipe(
      tap((user) => this.currentUserSubject.next(user)),
      catchError((error) => {
        this.logger.error('Erro ao carregar usuário', error);
        this.logout();
        return of(null as any);
      })
    );
  }

  // OAuth login methods
  loginWithOAuth(provider: string, userData: unknown): Observable<User> {
    this.logger.info('Login OAuth iniciado', { provider });
    return this.authApiService.login({ email: userData.email, password: userData.token } as any).pipe(
      tap((response) => {
        this.logger.info('Login OAuth bem-sucedido', { provider });
        this.saveAuthData(response.token);
        this.tokenSubject.next(response.token);
        this.currentUserSubject.next(response.user);
      }),
      map((response) => response.user),
      catchError((error) => {
        this.logger.error(`${provider} OAuth error`, error);
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
    this.logger.info('Atualizando perfil do usuário');
    return this.http
      .patch<User>(`/api/users/profile`, user)
      .pipe(tap((updatedUser) => this.currentUserSubject.next(updatedUser)));
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    this.logger.info('Alterando senha');
    return this.http.post<void>(`/api/auth/change-password`, {
      oldPassword,
      newPassword,
    });
  }

  forgotPassword(email: string): Observable<PasswordResetResponse> {
    this.logger.info('Solicitando reset de senha', { email });
    return this.authApiService.forgotPassword({ email }).pipe(
      catchError((error) => {
        this.logger.error('Erro ao solicitar reset de senha', error);
        throw error;
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<PasswordResetResponse> {
    this.logger.info('Realizando reset de senha');
    return this.authApiService.resetPassword({ token, newPassword }).pipe(
      catchError((error) => {
        this.logger.error('Erro ao realizar reset de senha', error);
        throw error;
      })
    );
  }

  validateResetToken(token: string): Observable<PasswordResetResponse> {
    this.logger.info('Validando token de reset');
    return this.http.post<PasswordResetResponse>(
      `/api/auth/validate-reset-token`,
      { token }
    );
  }

  loginWithGoogle(): Observable<User> {
    this.logger.info('Iniciando login com Google');
    return this.oauthService.loginWithGoogle().pipe(
      switchMap((googleResponse) => {
        return this.loginWithOAuth('google', googleResponse);
      })
    );
  }

  loginWithMicrosoft(): Observable<User> {
    this.logger.info('Iniciando login com Microsoft');
    return this.oauthService.loginWithMicrosoft().pipe(
      switchMap((microsoftResponse) => {
        return this.loginWithOAuth('microsoft', microsoftResponse);
      })
    );
  }
}