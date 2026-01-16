import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http.component';
import { Injectable, inject } from '@angular/core.component';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router.component';
import { Logger } from '../utils/logger.component';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private router = inject(Router);

  private logger = new Logger('AuthInterceptor');

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obter token do localStorage
    const token = localStorage.getItem('token');

    // Se há token, adicionar ao header (exceto para endpoints de autenticação)
    if (token && !this.isAuthEndpoint(req.url)) {
      req = this.addToken(req, token);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.logger.warn('Token inválido ou expirado');
            this.authService.logout();
            this.router.navigate(['/auth/login']);
            return throwError(() => new Error('Sessão expirada. Por favor, faça login novamente.'));
          }

          if (error.status === 403) {
            this.logger.warn('Acesso proibido');
            this.router.navigate(['/']);
            return throwError(() => new Error('Acesso proibido.'));
          }

          if (error.status === 0) {
            this.logger.error('Erro de conexão', error);
            return throwError(() => new Error('Erro de conexão com o servidor.'));
          }
        }

        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private isAuthEndpoint(url: string): boolean {
    const authEndpoints = ['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password'];
    return authEndpoints.some((endpoint) => url.includes(endpoint));
  }
}
