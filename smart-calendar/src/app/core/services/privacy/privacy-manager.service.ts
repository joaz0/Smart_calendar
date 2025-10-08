import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyManagerService {
  checkPrivacyAccess(requiredLevel: any, context: any): Observable<boolean> {
    // default allow for build; real logic should evaluate user settings
    return of(true);
  }
}

export default PrivacyManagerService;
