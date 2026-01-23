// Angular Core
import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

// RxJS
import { Subject, takeUntil, forkJoin } from 'rxjs';

// Services
import { CollaborationService, TeamMember, SharedEvent, TaskDelegation, CollaborationStats } from '../../../core/services/collaboration/collaboration.service';
import { STATUS_COLOR_VARS } from '../../../shared/tokens/color-tokens';

@Component({
  standalone: true,
  selector: 'app-collaboration-dashboard',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './collaboration-dashboard.component.html',
  styleUrl: './collaboration-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollaborationDashboardComponent implements OnInit, OnDestroy {
  private collaborationService = inject(CollaborationService);

  private destroy$ = new Subject<void>();

  teamMembers: TeamMember[] = [];
  sharedEvents: SharedEvent[] = [];
  delegations: TaskDelegation[] = [];
  stats: CollaborationStats | null = null;
  loading = false;

  ngOnInit() {
    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData() {
    this.loading = true;

    forkJoin({
      members: this.collaborationService.getTeamMembers(),
      events: this.collaborationService.getSharedEvents(),
      delegations: this.collaborationService.getDelegations(),
      stats: this.collaborationService.getCollaborationStats()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.teamMembers = data.members;
          this.sharedEvents = data.events;
          this.delegations = data.delegations;
          this.stats = data.stats;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar dados de colaboração:', err);
          this.loading = false;
        }
      });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'online': return STATUS_COLOR_VARS.success;
      case 'busy': return STATUS_COLOR_VARS.error;
      case 'away': return STATUS_COLOR_VARS.warning;
      case 'offline': return STATUS_COLOR_VARS.neutral;
      default: return STATUS_COLOR_VARS.neutral;
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'online': return 'Online';
      case 'busy': return 'Ocupado';
      case 'away': return 'Ausente';
      case 'offline': return 'Offline';
      default: return 'Desconhecido';
    }
  }

  getRoleText(role: string): string {
    switch (role) {
      case 'owner': return 'Proprietário';
      case 'admin': return 'Admin';
      case 'member': return 'Membro';
      case 'viewer': return 'Visualizador';
      default: return role;
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return STATUS_COLOR_VARS.error;
      case 'medium': return STATUS_COLOR_VARS.warning;
      case 'low': return STATUS_COLOR_VARS.success;
      default: return STATUS_COLOR_VARS.neutral;
    }
  }

  getEventTypeIcon(type: string): string {
    switch (type) {
      case 'meeting': return 'groups';
      case 'deadline': return 'flag';
      case 'milestone': return 'star';
      default: return 'event';
    }
  }

  getDelegationStatusColor(status: string): string {
    switch (status) {
      case 'pending': return STATUS_COLOR_VARS.warning;
      case 'accepted': return STATUS_COLOR_VARS.info;
      case 'rejected': return STATUS_COLOR_VARS.error;
      case 'completed': return STATUS_COLOR_VARS.success;
      default: return STATUS_COLOR_VARS.neutral;
    }
  }

  getDelegationStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'accepted': return 'Aceito';
      case 'rejected': return 'Rejeitado';
      case 'completed': return 'Concluído';
      default: return status;
    }
  }

  acceptDelegation(delegationId: string | number) {
    this.collaborationService.acceptDelegation(delegationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadDashboardData();
        },
        error: (err) => console.error('Erro ao aceitar delegação:', err)
      });
  }

  rejectDelegation(delegationId: string | number) {
    this.collaborationService.rejectDelegation(delegationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadDashboardData();
        },
        error: (err) => console.error('Erro ao rejeitar delegação:', err)
      });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getMemberName(memberId: string): string {
    const member = this.teamMembers.find(m => m.id === memberId);
    return member?.name || 'Desconhecido';
  }

  getAttendeeNames(attendeeIds: string[]): string {
    return attendeeIds
      .map(id => this.getMemberName(id))
      .join(', ');
  }

  isEventToday(evt: SharedEvent): boolean {
    const today = new Date();
    const eventDate = new Date(evt.start);
    return eventDate.toDateString() === today.toDateString();
  }

  trackByMember(index: number, member: TeamMember): string {
    return String(member.id);
  }

  trackByEvent(index: number, event: SharedEvent): string {
    return String(event.id);
  }

  trackByDelegation(index: number, delegation: TaskDelegation): string {
    return String(delegation.id);
  }
}
