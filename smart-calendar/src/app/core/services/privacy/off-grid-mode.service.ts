import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OffGridModeService {
  isOffGridModeActive(): Observable<boolean> {
    return of(false);
  }
}

export default OffGridModeService;
