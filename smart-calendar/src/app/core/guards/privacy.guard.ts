import { inject } from '@angular/core.component';
import { Router, type CanActivateFn } from '@angular/router.component';
import { map, switchMap, catchError, of, timeout, combineLatest } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar.component';

// Serviços de privacidade específicos
import { PrivacyManagerService } from '../services/privacy/privacy-manager.service';
import { EncryptionService } from '../services/privacy/encryption.service';
import { OffGridModeService } from '../services/privacy/off-grid-mode.service';
import { EventCamouflageService } from '../services/privacy/event-camouflage.service';

export enum PrivacyLevel {
  PUBLIC = 'public', // Dados totalmente públicos
  SHARED = 'shared', // Compartilhado com colaboradores
  PRIVATE = 'private', // Apenas usuário
  CONFIDENTIAL = 'confidential', // Dados sensíveis (saúde, localização)
  STEALTH = 'stealth', // Modo "off-grid" ou camuflagem
}

export enum PrivacyContext {
  CALENDAR_EVENTS = 'calendar_events',
  HEALTH_DATA = 'health_data',
  LOCATION_DATA = 'location_data',
  COLLABORATION = 'collaboration',
  PERSONAL_INSIGHTS = 'personal_insights',
  AI_TRAINING = 'ai_training',
  BACKUP_DATA = 'backup_data',
}

export const privacyGuard: CanActivateFn = (route, state) => {
  const privacyManager = inject(PrivacyManagerService);
  const encryptionService = inject(EncryptionService);
  const offGridService = inject(OffGridModeService);
  const eventCamouflageService = inject(EventCamouflageService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const requiredPrivacyLevel = route.data?.['privacyLevel'] as PrivacyLevel;
  const context = route.data?.['context'] as PrivacyContext;
  const requiresEncryption = route.data?.['requiresEncryption'] ?? false;
  const allowOffGrid = route.data?.['allowOffGrid'] ?? false;

  // Se não há requisitos de privacidade, permite acesso
  if (!requiredPrivacyLevel && !requiresEncryption) {
    return true;
  }

  return privacyManager.checkPrivacyAccess(requiredPrivacyLevel, context).pipe(
    timeout(5000),
    switchMap((hasPrivacyAccess) => {
      if (!hasPrivacyAccess) {
        console.warn(
          `Acesso negado por privacidade: nível ${requiredPrivacyLevel} para contexto ${context}`
        );
        snackBar.open('Acesso negado: Configurações de privacidade insuficientes', 'OK', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        return of(router.createUrlTree(['/privacy-control/privacy-control-center']));
      }

      // Verifica requisitos adicionais de segurança
      const checks = [];

      if (requiresEncryption) {
        checks.push(
          encryptionService.isDataEncrypted(context).pipe(
            map((isEncrypted) => {
              if (!isEncrypted) {
                console.warn(`Dados não criptografados para contexto: ${context}`);
                return false;
              }
              return true;
            }),
            catchError(() => of(true)) // Em caso de erro, permite acesso
          )
        );
      }

      if (!allowOffGrid) {
        checks.push(
          offGridService.isOffGridModeActive().pipe(
            map((isOffGrid) => {
              if (isOffGrid) {
                console.warn('Acesso negado: modo off-grid ativo');
                return false;
              }
              return true;
            }),
            catchError(() => of(true)) // Em caso de erro, permite acesso
          )
        );
      }

      // Verifica camuflagem para eventos sensíveis
      if (
        context === PrivacyContext.CALENDAR_EVENTS &&
        requiredPrivacyLevel === PrivacyLevel.STEALTH
      ) {
        checks.push(
          eventCamouflageService.isCamouflageEnabled().pipe(
            map((camouflageEnabled) => {
              if (!camouflageEnabled) {
                console.warn('Camuflagem de eventos não está ativa');
                return false;
              }
              return true;
            }),
            catchError(() => of(true)) // Em caso de erro, permite acesso
          )
        );
      }

      // Executa todas as verificações
      if (checks.length === 0) {
        return of(true);
      }

      return combineLatest(checks).pipe(
        map((results) => results.every((result) => result === true)),
        map((allChecksPassed) => {
          if (!allChecksPassed) {
            return router.createUrlTree(['/privacy-control/privacy-control-center'], {
              queryParams: {
                requiredLevel: requiredPrivacyLevel,
                context: context,
                returnUrl: state.url,
              },
            });
          }
          return true;
        }),
        catchError(() => of(true)) // Em caso de erro nas verificações, permite acesso
      );
    }),
    catchError((error) => {
      console.error('Erro na verificação de privacidade:', error);
      // Em desenvolvimento, permite acesso mesmo com erro
      return of(true);
    })
  );
};

// NOTE: avoid redefining combineLatest — use rxjs.combineLatest directly via imports.
