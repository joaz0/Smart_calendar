import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from '../../shared/components/header/header';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';

// Crie componentes básicos para os outros (placeholder)
@Component({
  selector: 'app-tasks-sidebar',
  standalone: true,
  template: `<div class="tasks-sidebar">Tasks Sidebar - Em desenvolvimento</div>`,
})
export class TasksSidebar {}

@Component({
  selector: 'app-ai-sidebar',
  standalone: true,
  template: `<div class="ai-sidebar">AI Sidebar - Em desenvolvimento</div>`,
})
export class AiSidebar {}

@Component({
  selector: 'app-productivity-sidebar',
  standalone: true,
  template: `<div class="productivity-sidebar">Productivity Sidebar - Em desenvolvimento</div>`,
})
export class ProductivitySidebar {}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    TasksSidebar,
    AiSidebar,
    ProductivitySidebar,
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout implements OnInit {
  // ... resto do código permanece igual
  currentActive = 'calendar';
  currentDate = new Date();
  currentTime = new Date();
  sidebarOpen = true;
  user = {
    name: 'Usuário',
    email: 'usuario@exemplo.com',
    avatar: '👤',
  };

  stats = {
    eventsToday: 3,
    pendingTasks: 5,
    completedTasks: 12,
    productivity: 75,
  };

  constructor(private router: Router) {}

  ngOnInit() {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateActiveTabFromRoute(event.url);
      });
  }

  setActive(view: string) {
    this.currentActive = view;
    const routes: { [key: string]: string } = {
      calendar: '/calendar',
      tasks: '/tasks',
      ai: '/ai-assistant',
      productivity: '/productivity',
    };

    if (routes[view]) {
      this.router.navigate([routes[view]]);
    }
  }

  private updateActiveTabFromRoute(url: string) {
    const routeMap: { [key: string]: string } = {
      '/calendar': 'calendar',
      '/tasks': 'tasks',
      '/ai-assistant': 'ai',
      '/productivity': 'productivity',
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
    console.log('Logout realizado');
    this.router.navigate(['/login']);
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
