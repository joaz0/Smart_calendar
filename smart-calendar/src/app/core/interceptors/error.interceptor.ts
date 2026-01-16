import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private snackBar = inject(MatSnackBar);


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry({ count: 1, delay: 1000 }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erro desconhecido';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else {
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Requisição inválida';
              break;
            case 401:
              errorMessage = 'Sessão expirada. Faça login novamente.';
              break;
            case 403:
              errorMessage = 'Acesso negado';
              break;
            case 404:
              errorMessage = 'Recurso não encontrado';
              break;
            case 409:
              errorMessage = error.error?.message || 'Conflito de dados';
              break;
            case 500:
              errorMessage = 'Erro no servidor. Tente novamente.';
              break;
            default:
              errorMessage = error.error?.message || `Erro ${error.status}`;
          }
        }
        
        this.snackBar.open(errorMessage, 'Fechar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
        
        return throwError(() => error);
      })
    );
  }
}


