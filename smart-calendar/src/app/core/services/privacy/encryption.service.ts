import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
  isDataEncrypted(context: any): Observable<boolean> {
    return of(true);
  }
}

export default EncryptionService;
