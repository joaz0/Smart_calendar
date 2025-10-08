import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of, timeout } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  // Verifica se a rota requer autenticação
  const requiresAuth = route.data?.['requiresAuth'] !== false;

  if (!requiresAuth) {
    return true;
  }

  return authService.isAuthenticated$().pipe(
    timeout(5000),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }

      snackBar.open('É necessário fazer login para acessar esta página', 'OK', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });

      // Redireciona para login mantendo a URL desejada
      return router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });
    }),

    catchError((error) => {
      console.error('Erro na verificação de autenticação:', error);
      snackBar.open('Erro ao verificar autenticação. Tente novamente.', 'OK', {
        duration: 3000,
      });
      return of(router.createUrlTree(['/auth/login']));
    })
  );
};

// Guard para rotas públicas (quando usuário já está autenticado)
export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return authService.isAuthenticated$().pipe(
    timeout(5000),
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        return true;
      }

      snackBar.open('Você já está logado!', 'OK', {
        duration: 2000,
      });

      // Se já está autenticado, redireciona para dashboard principal
      return router.createUrlTree(['/calendar']);
    }),
    catchError((error) => {
      console.error('Erro na verificação de autenticação:', error);
      return of(true);
    })
  );
};
