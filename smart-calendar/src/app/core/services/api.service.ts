import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { logger } from '../utils/logger';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  type?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private isLoading$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  /**
   * GET request
   */
  get<T>(endpoint: string, options?: any): Observable<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, null, options);
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body: any, options?: any): Observable<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, body, options);
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body: any, options?: any): Observable<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, body, options);
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body: any, options?: any): Observable<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, body, options);
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, options?: any): Observable<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, null, options);
  }

  /**
   * Core request method
   */
  private request<T>(
    method: string,
    endpoint: string,
    body: any = null,
    options: any = {}
  ): Observable<ApiResponse<T>> {
    const url = `${this.apiUrl}${endpoint}`;
    const httpOptions = this.getHttpOptions(options);

    this.isLoading$.next(true);

    const request$ =
      method === 'GET'
        ? this.http.get<ApiResponse<T>>(url, httpOptions)
        : method === 'POST'
        ? this.http.post<ApiResponse<T>>(url, body, httpOptions)
        : method === 'PUT'
        ? this.http.put<ApiResponse<T>>(url, body, httpOptions)
        : method === 'PATCH'
        ? this.http.patch<ApiResponse<T>>(url, body, httpOptions)
        : method === 'DELETE'
        ? this.http.delete<ApiResponse<T>>(url, httpOptions)
        : throwError(() => new Error('Método HTTP desconhecido'));

    return request$.pipe(
      timeout(30000),
      retry({ count: 1, delay: 1000 }),
      catchError((error) => this.handleError(error, method, endpoint)),
      (obs) =>
        new Observable((subscriber) => {
          const sub = obs.subscribe({
            next: (value) => {
              this.isLoading$.next(false);
              subscriber.next(value);
            },
            error: (err) => {
              this.isLoading$.next(false);
              subscriber.error(err);
            },
            complete: () => {
              this.isLoading$.next(false);
              subscriber.complete();
            },
          });
          return () => sub.unsubscribe();
        })
    );
  }

  /**
   * Configurar headers HTTP
   */
  private getHttpOptions(options: any): any {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return {
      headers,
      ...options,
    };
  }

  /**
   * Tratamento de erros
   */
  private handleError(error: any, method: string, endpoint: string): Observable<never> {
    let errorMessage = 'Erro desconhecido';
    let statusCode = 500;

    if (error instanceof HttpErrorResponse) {
      statusCode = error.status;
      const errorResponse = error.error as ApiResponse<any>;

      if (errorResponse?.error) {
        errorMessage = errorResponse.error;
      } else if (error.status === 0) {
        errorMessage = 'Não foi possível conectar ao servidor';
      } else if (error.status === 401) {
        errorMessage = 'Sessão expirada. Faça login novamente.';
        this.clearAuth();
      } else if (error.status === 403) {
        errorMessage = 'Acesso negado';
      } else if (error.status === 404) {
        errorMessage = 'Recurso não encontrado';
      } else if (error.status === 409) {
        errorMessage = errorResponse?.error || 'Conflito nos dados';
      } else if (error.status >= 500) {
        errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
      }
    }

    logger.error(`Erro ${method} ${endpoint}`, {
      statusCode,
      message: errorMessage,
    });

    return throwError(() => ({
      statusCode,
      message: errorMessage,
      error,
    }));
  }

  /**
   * Limpar dados de autenticação
   */
  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    window.location.href = '/auth/login';
  }

  /**
   * Retornar estado de carregamento
   */
  isLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
