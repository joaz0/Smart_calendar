import { Component, OnInit, OnDestroy, signal, ChangeDetectorRef, ChangeDetectionStrategy, inject } from '@angular/core';

import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from '../../core/services/auth.service';
import { UserService, UserProfile, UserStats } from '../../core/services/user.service';
import { TaskService } from '../../core/services/task.service';
import { EventService } from '../../core/services/event.service';
import { ThemeService } from '../../core/services/theme.service';
import { NotificationService } from '../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    LoadingSpinnerComponent,
    CommonModule,
    RouterOutlet
],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private taskService = inject(TaskService);
  private eventService = inject(EventService);
  private themeService = inject(ThemeService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);


  private destroy$ = new Subject<void>();
  private timeInterval: number | undefined;
  currentActive = 'calendar';
  currentDate = new Date();
  currentTime = new Date();
  sidebarOpen = true;
  isLoading = false;
  isMobile = false;

  // Estado reativo para a sidebar
  sidebarCollapsed = signal(false);

  userStats: {
    todayEvents: number;
    pendingTasks: number;
    completedTasks: number;
    weeklyFocus: number;
  } = {
    todayEvents: 0,
    pendingTasks: 0,
    completedTasks: 0,
    weeklyFocus: 0
  };
  currentUser: { name: string; email: string; avatar: string | null } = {
    name: 'Carregando...',
    email: '',
    avatar: null
  };
  user: { name: string; email: string; avatar: string | null } = {
    name: 'Carregando...',
    email: '',
    avatar: null
  };

  stats = {
    todayEvents: 0,
    pendingTasks: 0,
    completedTasks: 0,
    weeklyFocus: 0,
  };

  notificationsSignal = signal(0);
  isOnlineSignal = signal(true);

  ngOnInit() {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    this.router.events
      .pipe(
        filter((evt) => evt instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((evt: NavigationEnd) => {
        this.updateActiveTabFromRoute(evt.url);
      });

    this.loadUserData();
    this.loadStats();
    this.initializeNotifications();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private loadUserData() {
    this.userService.getProfile()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Erro ao carregar perfil:', error);
          return of({
            name: 'Usuário',
            email: '',
            avatar: null,
            preferences: {},
            id: '',
            createdAt: new Date(),
            updatedAt: new Date()
          } as UserProfile);
        })
      )
      .subscribe({
        next: (profile: UserProfile) => {
          this.user = {
            name: profile.name || 'Usuário',
            email: profile.email,
            avatar: profile.avatar ?? null
          };
          this.currentUser = this.user;
          this.cdr.markForCheck();
        }
      });
  }

  private loadStats() {
    this.userService.getStats()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Erro ao carregar estatísticas:', error);
          return of({
            events_today: 0,
            pending_tasks: 0,
            completed_tasks: 0,
            productivity_score: 0
          } as UserStats);
        })
      )
      .subscribe({
        next: (stats: UserStats) => {
          this.stats = {
            todayEvents: stats.events_today || 0,
            pendingTasks: stats.pending_tasks || 0,
            completedTasks: stats.completed_tasks || 0,
            weeklyFocus: stats.productivity_score || 0
          };
          this.userStats = this.stats;
          this.notificationsSignal.set(this.stats.pendingTasks);
          this.cdr.markForCheck();
        }
      });
  }

  private initializeNotifications() {
    this.notificationService.initializeNotifications();
  }

  setActive(view: string) {
    this.currentActive = view;
    const routes: Record<string, string> = {
      calendar: '/app/calendar',
      tasks: '/app/tasks',
      ai: '/app/ai-assistant',
      productivity: '/app/productivity',
    };

    if (routes[view]) {
      this.router.navigate([routes[view]]);
    }
  }

  private updateActiveTabFromRoute(url: string) {
    const routeMap: Record<string, string> = {
      '/app/calendar': 'calendar',
      '/app/tasks': 'tasks',
      '/app/ai-assistant': 'ai',
      '/app/productivity': 'productivity',
      '/app/events': 'events',
      '/app/collaboration': 'collaboration',
      '/app/wellness': 'wellness',
      '/app/analytics': 'analytics',
      '/app/integrations': 'integrations',
      '/app/privacy': 'privacy',
      '/app/settings': 'settings'
    };

    // Find exact match first, then partial match
    const exactMatch = Object.keys(routeMap).find(route => url === route);
    if (exactMatch) {
      this.currentActive = routeMap[exactMatch];
      return;
    }

    // Fallback to partial match
    for (const [route, tab] of Object.entries(routeMap)) {
      if (url.includes(route)) {
        this.currentActive = tab;
        break;
      }
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(value => !value);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  getProductivityColor(): string {
    if (this.stats.weeklyFocus >= 80) return '#4CAF50';
    if (this.stats.weeklyFocus >= 60) return '#FF9800';
    return '#F44336';
  }

  getGreeting(): string {
    const hour = this.currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  onToggleTheme() {
    this.themeService.toggleTheme();
  }

  onOpenNotifications() {
    // Implementar painel de notificações
    console.log('Abrindo notificações');
    // Simular notificações
    alert('Você tem 3 notificações pendentes:\n\n1. Reunião em 15 minutos\n2. Tarefa vencendo hoje\n3. Novo evento adicionado');
  }

  onOpenProfile() {
    this.router.navigate(['/app/settings']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  openProfile(): void {
    this.router.navigate(['/app/settings']);
  }

  openNotifications(): void {
    this.onOpenNotifications();
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  // Novas funcionalidades para melhorar a experiência
  createQuickEvent(): void {
    const title = prompt('Digite o título do evento:');
    if (title) {
      const startTime = prompt('Horário (HH:MM):');
      if (startTime) {
        console.log(`Evento criado: ${title} às ${startTime}`);
        alert(`Evento "${title}" criado com sucesso!`);
        this.loadStats(); // Atualizar estatísticas
      }
    }
  }

  createQuickTask(): void {
    const title = prompt('Digite o título da tarefa:');
    if (title) {
      console.log(`Tarefa criada: ${title}`);
      alert(`Tarefa "${title}" criada com sucesso!`);
      this.loadStats(); // Atualizar estatísticas
    }
  }

  refreshData(): void {
    console.log('Atualizando dados...');
    this.loadUserData();
    this.loadStats();
    alert('Dados atualizados com sucesso!');
  }
}
