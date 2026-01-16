import { Injectable } from '@angular/core.component';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OffGridModeService {
  
  isOffGridModeActive(): Observable<boolean> {
    // Implementação básica - modo off-grid desativado
    return of(false);
  }
}