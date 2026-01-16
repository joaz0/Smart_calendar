import { Injectable, inject } from '@angular/core.component';
import { HttpClient } from '@angular/common/http.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators.component';
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
  private apiService = inject(ApiService);
  private http = inject(HttpClient);


  /**
   * Login do usuário
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
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
    return this.apiService.post<AuthResponse>('/auth/register', data).pipe(
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
    return this.apiService.get<User>('/auth/me').pipe(
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
    return this.apiService.post<{ message: string }>('/auth/forgot-password', request).pipe(
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
    return this.apiService.post<{ message: string }>('/auth/reset-password', request).pipe(
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
