import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'online' | 'offline' | 'busy' | 'away';
  availability: {
    start: string;
    end: string;
  };
}

export interface SharedEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  attendees: string[];
  organizer: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  type: 'meeting' | 'deadline' | 'milestone' | 'other';
}

export interface TaskDelegation {
  id: string;
  taskId: string;
  taskTitle: string;
  fromUser: string;
  toUser: string;
  delegatedAt: Date;
  dueDate: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface CollaborationStats {
  totalMembers: number;
  activeMembers: number;
  sharedEvents: number;
  pendingDelegations: number;
  completedTasks: number;
}

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/collaboration`;
  private teamMembersSubject = new BehaviorSubject<TeamMember[]>([]);
  public teamMembers$ = this.teamMembersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTeamMembers();
  }

  loadTeamMembers(): void {
    this.http.get<TeamMember[]>(`${this.apiUrl}/team`).pipe(
      catchError(() => of(this.getMockTeamMembers()))
    ).subscribe(members => {
      this.teamMembersSubject.next(members);
    });
  }

  getTeamMembers(): Observable<TeamMember[]> {
    return this.teamMembers$;
  }

  getSharedEvents(): Observable<SharedEvent[]> {
    return this.http.get<SharedEvent[]>(`${this.apiUrl}/events`).pipe(
      catchError(() => of(this.getMockSharedEvents()))
    );
  }

  getDelegations(): Observable<TaskDelegation[]> {
    return this.http.get<TaskDelegation[]>(`${this.apiUrl}/delegations`).pipe(
      catchError(() => of(this.getMockDelegations()))
    );
  }

  getCollaborationStats(): Observable<CollaborationStats> {
    return this.http.get<CollaborationStats>(`${this.apiUrl}/stats`).pipe(
      catchError(() => of(this.getMockStats()))
    );
  }

  delegateTask(taskId: string, toUserId: string, notes?: string): Observable<TaskDelegation> {
    return this.http.post<TaskDelegation>(`${this.apiUrl}/delegate`, {
      taskId,
      toUserId,
      notes
    }).pipe(
      catchError(() => of(this.createMockDelegation(taskId, toUserId, notes)))
    );
  }

  acceptDelegation(delegationId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delegations/${delegationId}/accept`, {});
  }

  rejectDelegation(delegationId: string, reason?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delegations/${delegationId}/reject`, { reason });
  }

  inviteTeamMember(email: string, role: TeamMember['role']): Observable<TeamMember> {
    return this.http.post<TeamMember>(`${this.apiUrl}/team/invite`, { email, role }).pipe(
      tap(member => {
        const currentMembers = this.teamMembersSubject.value;
        this.teamMembersSubject.next([...currentMembers, member]);
      })
    );
  }

  removeTeamMember(memberId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/team/${memberId}`).pipe(
      tap(() => {
        const currentMembers = this.teamMembersSubject.value;
        this.teamMembersSubject.next(currentMembers.filter(m => m.id !== memberId));
      })
    );
  }

  private getMockTeamMembers(): TeamMember[] {
    return [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao.silva@example.com',
        role: 'owner',
        status: 'online',
        availability: { start: '09:00', end: '18:00' }
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria.santos@example.com',
        role: 'admin',
        status: 'online',
        availability: { start: '08:00', end: '17:00' }
      },
      {
        id: '3',
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@example.com',
        role: 'member',
        status: 'busy',
        availability: { start: '10:00', end: '19:00' }
      },
      {
        id: '4',
        name: 'Ana Costa',
        email: 'ana.costa@example.com',
        role: 'member',
        status: 'away',
        availability: { start: '09:00', end: '18:00' }
      }
    ];
  }

  private getMockSharedEvents(): SharedEvent[] {
    return [
      {
        id: '1',
        title: 'Reunião de Sprint Planning',
        start: new Date(Date.now() + 2 * 60 * 60 * 1000),
        end: new Date(Date.now() + 3 * 60 * 60 * 1000),
        attendees: ['1', '2', '3'],
        organizer: '1',
        status: 'confirmed',
        type: 'meeting'
      },
      {
        id: '2',
        title: 'Entrega do Projeto X',
        start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        attendees: ['1', '2', '3', '4'],
        organizer: '2',
        status: 'confirmed',
        type: 'deadline'
      },
      {
        id: '3',
        title: 'Review Semanal',
        start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        attendees: ['1', '2'],
        organizer: '1',
        status: 'pending',
        type: 'meeting'
      }
    ];
  }

  private getMockDelegations(): TaskDelegation[] {
    return [
      {
        id: '1',
        taskId: 'task-1',
        taskTitle: 'Revisar documentação técnica',
        fromUser: '1',
        toUser: '2',
        delegatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'accepted',
        priority: 'high'
      },
      {
        id: '2',
        taskId: 'task-2',
        taskTitle: 'Atualizar testes unitários',
        fromUser: '2',
        toUser: '3',
        delegatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'medium',
        notes: 'Focar nos testes de integração'
      },
      {
        id: '3',
        taskId: 'task-3',
        taskTitle: 'Implementar nova feature',
        fromUser: '1',
        toUser: '4',
        delegatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'completed',
        priority: 'high'
      }
    ];
  }

  private getMockStats(): CollaborationStats {
    return {
      totalMembers: 4,
      activeMembers: 3,
      sharedEvents: 3,
      pendingDelegations: 1,
      completedTasks: 5
    };
  }

  private createMockDelegation(taskId: string, toUserId: string, notes?: string): TaskDelegation {
    return {
      id: `delegation-${Date.now()}`,
      taskId,
      taskTitle: 'Nova Tarefa Delegada',
      fromUser: 'current-user',
      toUser: toUserId,
      delegatedAt: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'pending',
      priority: 'medium',
      notes
    };
  }
}
