import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from '../../shared/components/header/header';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { AuthService } from '../../core/services/auth.service';
import { UserService, UserProfile, UserStats } from '../../core/services/user.service';
import { TaskService } from '../../core/services/task.service';
import { EventService } from '../../core/services/event.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Header,
    SidebarComponent
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout implements OnInit {
  currentActive = 'calendar';
  currentDate = new Date();
  currentTime = new Date();
  sidebarOpen = true;
  user: any = {
    name: 'Carregando...',
    email: '',
    avatar: '👤',
    preferences: {}
  };

  stats = {
    eventsToday: 0,
    pendingTasks: 0,
    completedTasks: 0,
    productivity: 0,
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private taskService: TaskService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateActiveTabFromRoute(event.url);
      });

    this.loadUserData();
    this.loadStats();
  }

  private loadUserData() {
    this.userService.getProfile().subscribe({
      next: (profile: UserProfile) => {
        this.user = {
          name: profile.name || 'Usuário',
          email: profile.email,
          avatar: profile.avatar || '👤',
          preferences: profile.preferences || {}
        };
      },
      error: (error: any) => {
        console.error('Erro ao carregar perfil:', error);
        this.user = {
          name: 'Usuário',
          email: '',
          avatar: '👤',
          preferences: {}
        };
      }
    });
  }

  private loadStats() {
    this.userService.getStats().subscribe({
      next: (stats: UserStats) => {
        this.stats = {
          eventsToday: stats.events_today || 0,
          pendingTasks: stats.pending_tasks || 0,
          completedTasks: stats.completed_tasks || 0,
          productivity: stats.productivity_score || 0
        };
      },
      error: (error: any) => {
        console.error('Erro ao carregar estatísticas:', error);
        this.stats = {
          eventsToday: 0,
          pendingTasks: 0,
          completedTasks: 0,
          productivity: 0
        };
      }
    });
  }

  setActive(view: string) {
    this.currentActive = view;
    const routes: { [key: string]: string } = {
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
    const routeMap: { [key: string]: string } = {
      '/app/calendar': 'calendar',
      '/app/tasks': 'tasks',
      '/app/ai-assistant': 'ai',
      '/app/productivity': 'productivity',
    };

    for (const [route, tab] of Object.entries(routeMap)) {
      if (url.includes(route)) {
        this.currentActive = tab;
        break;
      }
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  getProductivityColor(): string {
    if (this.stats.productivity >= 80) return '#4CAF50';
    if (this.stats.productivity >= 60) return '#FF9800';
    return '#F44336';
  }

  getGreeting(): string {
    const hour = this.currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }
}
