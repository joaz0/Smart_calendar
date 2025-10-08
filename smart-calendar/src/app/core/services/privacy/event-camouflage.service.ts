import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventCamouflageService {
  isCamouflageEnabled(): Observable<boolean> {
    return of(true);
  }
}

export default EventCamouflageService;
