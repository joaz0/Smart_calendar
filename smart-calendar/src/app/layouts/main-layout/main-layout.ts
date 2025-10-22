import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from '../../shared/components/header/header';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
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
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = {
          name: user.name || 'Usuário',
          email: user.email || '',
          avatar: user.avatar || '👤',
          preferences: user.preferences || {}
        };
      }
    });
  }

  private loadStats() {
    // Carregar eventos de hoje
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    this.eventService.getEventsByDateRange(startOfDay, endOfDay).subscribe({
      next: (events) => {
        this.stats.eventsToday = events.length;
      },
      error: () => {
        this.stats.eventsToday = 0;
      }
    });

    // Carregar tarefas
    this.taskService.tasks$.subscribe(tasks => {
      this.stats.pendingTasks = tasks.filter(t => !t.completed).length;
      this.stats.completedTasks = tasks.filter(t => t.completed).length;
      
      // Calcular produtividade baseada em tarefas completadas
      const totalTasks = tasks.length;
      if (totalTasks > 0) {
        this.stats.productivity = Math.round((this.stats.completedTasks / totalTasks) * 100);
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
