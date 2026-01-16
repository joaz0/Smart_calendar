import { Injectable, inject } from '@angular/core.component';
import { HttpClient } from '@angular/common/http.component';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators.component';
import { environment } from '../../../../environments/environment.component';

export interface TaskDelegation {
  id: string;
  taskId: string;
  fromUser: string;
  toUser: string;
  status: 'pending' | 'accepted' | 'rejected';
  delegatedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class TaskDelegationService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/collaboration/delegation`;

  delegateTask(taskId: string, toUser: string): Observable<TaskDelegation> {
    return this.http.post<TaskDelegation>(this.apiUrl, { taskId, toUser }).pipe(
      catchError(() => of({
        id: Date.now().toString(),
        taskId,
        fromUser: 'current',
        toUser,
        status: 'pending',
        delegatedAt: new Date()
      }))
    );
  }

  respondToDelegation(delegationId: string, accept: boolean): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${delegationId}/respond`, { accept }).pipe(
      catchError(() => of(undefined))
    );
  }

  getPendingDelegations(): Observable<TaskDelegation[]> {
    return this.http.get<TaskDelegation[]>(`${this.apiUrl}/pending`).pipe(
      catchError(() => of([]))
    );
  }
}
