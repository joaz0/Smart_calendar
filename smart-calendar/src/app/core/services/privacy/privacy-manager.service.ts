import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PrivacyLevel, PrivacyContext } from '../../guards/privacy.guard';

@Injectable({
  providedIn: 'root'
})
export class PrivacyManagerService {
  
  checkPrivacyAccess(level: PrivacyLevel, context: PrivacyContext): Observable<boolean> {
    // Implementação básica - sempre permite acesso
    // Em produção, verificaria configurações reais do usuário
    return of(true);
  }
}