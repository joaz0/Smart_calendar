import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService, ApiResponse } from '../api.service';
import type {
  TeamMember,
  SharedEvent,
  TaskDelegation,
  CollaborationStats,
} from '../../types/collaboration.types';

export type {
  TeamMember,
  SharedEvent,
  TaskDelegation,
  CollaborationStats,
  TeamUpdate,
} from '../../types/collaboration.types';

@Injectable({
  providedIn: 'root',
})
export class CollaborationService {
  private readonly basePath = 'collaboration';
  private readonly defaultTeamId = 'current-team';

  private statsSubject = new BehaviorSubject<CollaborationStats | null>(null);
  stats$ = this.statsSubject.asObservable();

  private teamMembersSubject = new BehaviorSubject<TeamMember[]>([]);
  teamMembers$ = this.teamMembersSubject.asObservable();

  private availabilitySubject = new BehaviorSubject<TeamMember['availability'][]>([]);
  availability$ = this.availabilitySubject.asObservable();

  constructor(private apiService: ApiService) {}

  loadDashboardData(teamId = this.defaultTeamId): void {
    this.getCollaborationStats().subscribe();
    this.getTeamMembers(teamId).subscribe();
    this.getSharedEvents().subscribe();
    this.getDelegations().subscribe();
  }

  getCollaborationStats(): Observable<CollaborationStats> {
    return this.apiService.get<CollaborationStats>(`${this.basePath}/stats`).pipe(
      map((response: ApiResponse<CollaborationStats>) => response.data || this.getEmptyStats()),
      tap((stats) => this.statsSubject.next(stats)),
      catchError((error) => {
        console.error('Erro ao buscar stats', error);
        const stats = this.getEmptyStats();
        this.statsSubject.next(stats);
        return of(stats);
      })
    );
  }

  getTeamMembers(teamId = this.defaultTeamId): Observable<TeamMember[]> {
    return this.apiService.get<TeamMember[]>(`teams/${teamId}/members`).pipe(
      map((response: ApiResponse<TeamMember[]>) => response.data || []),
      tap((members) => {
        this.teamMembersSubject.next(members);
        this.availabilitySubject.next(members.map((member) => member.availability));
      }),
      catchError((error) => {
        console.error('Erro ao buscar membros do time', error);
        const members = this.getMockTeamMembers();
        this.teamMembersSubject.next(members);
        this.availabilitySubject.next(members.map((member) => member.availability));
        return of(members);
      })
    );
  }

  getSharedEvents(): Observable<SharedEvent[]> {
    return this.apiService.get<SharedEvent[]>(`${this.basePath}/events`).pipe(
      map((response: ApiResponse<SharedEvent[]>) => response.data || []),
      catchError((error) => {
        console.error('Erro ao buscar eventos compartilhados', error);
        return of(this.getMockSharedEvents());
      })
    );
  }

  getDelegations(): Observable<TaskDelegation[]> {
    return this.apiService.get<TaskDelegation[]>(`${this.basePath}/delegations`).pipe(
      map((response: ApiResponse<TaskDelegation[]>) => response.data || []),
      catchError((error) => {
        console.error('Erro ao buscar delegacoes', error);
        return of(this.getMockDelegations());
      })
    );
  }

  acceptDelegation(delegationId: string | number): Observable<void> {
    const id = String(delegationId);
    return this.apiService.post<void>(`${this.basePath}/delegations/${id}/accept`, {}).pipe(
      map(() => undefined),
      tap(() => {
        this.getDelegations().subscribe();
      }),
      catchError(() => of(undefined))
    );
  }

  rejectDelegation(delegationId: string | number, reason?: string): Observable<void> {
    const id = String(delegationId);
    return this.apiService.post<void>(`${this.basePath}/delegations/${id}/reject`, { reason }).pipe(
      map(() => undefined),
      tap(() => {
        this.getDelegations().subscribe();
      }),
      catchError(() => of(undefined))
    );
  }

  inviteTeamMember(teamId: string, email: string): Observable<boolean> {
    return this.apiService.post<void>(`teams/${teamId}/invite`, { email }).pipe(
      map((response) => response.success),
      catchError(() => of(false))
    );
  }

  removeTeamMember(teamId: string, memberId: string): Observable<boolean> {
    return this.apiService.delete<void>(`teams/${teamId}/members/${memberId}`).pipe(
      map((response) => response.success),
      tap(() => {
        const current = this.teamMembersSubject.value;
        this.teamMembersSubject.next(current.filter((member) => member.id !== memberId));
      }),
      catchError(() => of(false))
    );
  }

  private getEmptyStats(): CollaborationStats {
    return {
      totalMembers: 0,
      activeMembers: 0,
      sharedEvents: 0,
      pendingDelegations: 0,
      completedTasks: 0,
    };
  }

  private getMockTeamMembers(): TeamMember[] {
    return [
      {
        id: '1',
        name: 'Joao Silva',
        email: 'joao.silva@example.com',
        role: 'owner',
        status: 'online',
        availability: { start: '09:00', end: '18:00' },
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria.santos@example.com',
        role: 'admin',
        status: 'online',
        availability: { start: '08:00', end: '17:00' },
      },
      {
        id: '3',
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@example.com',
        role: 'member',
        status: 'busy',
        availability: { start: '10:00', end: '19:00' },
      },
      {
        id: '4',
        name: 'Ana Costa',
        email: 'ana.costa@example.com',
        role: 'member',
        status: 'away',
        availability: { start: '09:00', end: '18:00' },
      },
    ];
  }

  private getMockSharedEvents(): SharedEvent[] {
    return [
      {
        id: '1',
        title: 'Reuniao de Sprint Planning',
        start: new Date(Date.now() + 2 * 60 * 60 * 1000),
        end: new Date(Date.now() + 3 * 60 * 60 * 1000),
        attendees: ['1', '2', '3'],
        organizer: '1',
        status: 'confirmed',
        type: 'meeting',
      },
      {
        id: '2',
        title: 'Entrega do Projeto X',
        start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        attendees: ['1', '2', '3', '4'],
        organizer: '2',
        status: 'confirmed',
        type: 'deadline',
      },
      {
        id: '3',
        title: 'Review Semanal',
        start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        attendees: ['1', '2'],
        organizer: '1',
        status: 'pending',
        type: 'meeting',
      },
    ];
  }

  private getMockDelegations(): TaskDelegation[] {
    return [
      {
        id: '1',
        taskId: 'task-1',
        taskTitle: 'Revisar documentacao tecnica',
        fromUser: '1',
        toUser: '2',
        delegatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'accepted',
        priority: 'high',
      },
      {
        id: '2',
        taskId: 'task-2',
        taskTitle: 'Atualizar testes unitarios',
        fromUser: '2',
        toUser: '3',
        delegatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'medium',
        notes: 'Preciso disso antes do merge',
      },
    ];
  }
}
