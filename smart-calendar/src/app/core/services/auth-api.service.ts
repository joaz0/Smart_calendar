import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { User } from '../models/user.model';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(private apiService: ApiService, private http: HttpClient) {}

  /**
   * Login do usuário
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/api/auth/login', credentials).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro no login');
      })
    );
  }

  /**
   * Registro de novo usuário
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/api/auth/register', data).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro no registro');
      })
    );
  }

  /**
   * Obter dados do usuário atual
   */
  getCurrentUser(): Observable<User> {
    return this.apiService.get<User>('/api/auth/me').pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error('Não foi possível obter dados do usuário');
      })
    );
  }

  /**
   * Solicitar reset de senha
   */
  forgotPassword(request: ForgotPasswordRequest): Observable<{ message: string }> {
    return this.apiService.post<{ message: string }>('/api/auth/forgot-password', request).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao solicitar reset');
      })
    );
  }

  /**
   * Reset de senha
   */
  resetPassword(request: ResetPasswordRequest): Observable<{ message: string }> {
    return this.apiService.post<{ message: string }>('/api/auth/reset-password', request).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao resetar senha');
      })
    );
  }

  /**
   * Logout (apenas cliente-side)
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
  }
}
