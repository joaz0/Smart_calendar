import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PrivacyContext } from '../../guards/privacy.guard';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  
  isDataEncrypted(context: PrivacyContext): Observable<boolean> {
    // Implementação básica - assume dados não criptografados
    return of(false);
  }
}