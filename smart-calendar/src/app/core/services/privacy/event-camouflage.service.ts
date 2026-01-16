import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventCamouflageService {
  
  isCamouflageEnabled(): Observable<boolean> {
    // Implementação básica - camuflagem desativada
    return of(false);
  }
}