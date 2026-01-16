import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { UserProfile, UserStats } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class MockUserService {
  getProfile(): Observable<UserProfile> {
    return of({
      id: 1,
      name: 'Usuário Teste',
      email: 'teste@smartcalendar.com',
      avatar: '👤',
      preferences: {
        theme: 'dark',
        language: 'pt-BR'
      }
    } as UserProfile).pipe(delay(300));
  }

  getStats(): Observable<UserStats> {
    return of({
      events_today: 3,
      pending_tasks: 5,
      completed_tasks: 12,
      productivity_score: 75
    } as UserStats).pipe(delay(300));
  }
}
