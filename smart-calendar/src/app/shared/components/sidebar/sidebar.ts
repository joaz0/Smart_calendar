import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  children?: NavItem[];
  isExpanded?: boolean;
}

interface UserStats {
  todayEvents: number;
  pendingTasks: number;
  completedTasks: number;
  weeklyFocus: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule, 
    MatButtonModule, 
    MatMenuModule, 
    MatTooltipModule, 
    MatDividerModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() isOpen: boolean = true;
  @Input() currentActive: string = 'calendar';
  @Input() stats: UserStats = {
    todayEvents: 0,
    pendingTasks: 0,
    completedTasks: 0,
    weeklyFocus: 0
  };
  @Input() user: any = {
    name: 'Usuário',
    email: 'user@example.com',
    avatar: null
  };
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() searchQuery = new EventEmitter<string>();

  searchTerm: string = '';
  notifications: number = 3;
  filteredNavItems: NavItem[] = [];
  searchResults: any[] = [];
  hasUnreadNotifications: boolean = true;
  recentNotifications: any[] = [];

  constructor(private router: Router) {}

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/app/dashboard',
    },
    {
      label: 'Calendário',
      icon: 'calendar_today',
      route: '/app/calendar',
      badge: this.stats.todayEvents,
    },
    {
      label: 'Tarefas',
      icon: 'task_alt',
      route: '/app/tasks',
      badge: this.stats.pendingTasks,
    },
    {
      label: 'Eventos',
      icon: 'event',
      route: '/app/events',
    },
    {
      label: 'Assistente IA',
      icon: 'smart_toy',
      route: '/app/ai-assistant',
    },
    {
      label: 'Colaboração',
      icon: 'groups',
      route: '/app/collaboration',
      isExpanded: false,
      children: [
        { label: 'Dashboard', icon: 'analytics', route: '/app/collaboration/dashboard' },
        { label: 'Equipe', icon: 'group', route: '/app/collaboration/team' },
        { label: 'Disponibilidade', icon: 'schedule', route: '/app/collaboration/availability' },
        { label: 'Reuniões', icon: 'videocam', route: '/app/collaboration/meetings' },
      ],
    },
    {
      label: 'Produtividade',
      icon: 'trending_up',
      route: '/app/productivity',
      isExpanded: false,
      children: [
        { label: 'Foco', icon: 'center_focus_strong', route: '/app/productivity/focus' },
        { label: 'Hábitos', icon: 'repeat', route: '/app/productivity/habits' },
        { label: 'Templates', icon: 'description', route: '/app/productivity/templates' },
        { label: 'Pomodoro', icon: 'timer', route: '/app/productivity/pomodoro' },
      ],
    },
    {
      label: 'Bem-estar',
      icon: 'favorite',
      route: '/app/wellness',
      isExpanded: false,
      children: [
        { label: 'Dashboard', icon: 'insights', route: '/app/wellness/dashboard' },
        { label: 'Pausas', icon: 'coffee', route: '/app/wellness/breaks' },
        { label: 'Meditação', icon: 'spa', route: '/app/wellness/meditation' },
        { label: 'Sono', icon: 'bedtime', route: '/app/wellness/sleep' },
      ],
    },
    {
      label: 'Analytics',
      icon: 'pie_chart',
      route: '/app/analytics',
      isExpanded: false,
      children: [
        { label: 'Tempo', icon: 'schedule', route: '/app/analytics/time' },
        { label: 'Produtividade', icon: 'show_chart', route: '/app/analytics/productivity' },
        { label: 'Insights', icon: 'lightbulb', route: '/app/analytics/insights' },
        { label: 'Relatórios', icon: 'assignment', route: '/app/analytics/reports' },
      ],
    },
    {
      label: 'Integrações',
      icon: 'extension',
      route: '/app/integrations',
    },
    {
      label: 'Configurações',
      icon: 'settings',
      route: '/app/settings',
    },
  ];

  ngOnInit() {
    this.filteredNavItems = [...this.navItems];
    this.updateBadges();
  }

  updateBadges() {
    this.navItems.forEach(item => {
      if (item.route === '/app/calendar') {
        item.badge = this.stats.todayEvents;
      } else if (item.route === '/app/tasks') {
        item.badge = this.stats.pendingTasks;
      }
    });
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredNavItems = [...this.navItems];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredNavItems = this.navItems.filter(item => 
      item.label.toLowerCase().includes(term) ||
      (item.children && item.children.some(child => 
        child.label.toLowerCase().includes(term)
      ))
    );
    
    this.searchQuery.emit(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredNavItems = [...this.navItems];
  }

  toggleSubmenu(item: NavItem) {
    if (item.children) {
      item.isExpanded = !item.isExpanded;
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  getCompletionPercentage(): number {
    const total = this.stats.pendingTasks + this.stats.completedTasks;
    return total > 0 ? Math.round((this.stats.completedTasks / total) * 100) : 0;
  }

  getFocusLevel(): string {
    if (this.stats.weeklyFocus >= 80) return 'Alto';
    if (this.stats.weeklyFocus >= 60) return 'Médio';
    return 'Baixo';
  }

  getFocusColor(): string {
    if (this.stats.weeklyFocus >= 80) return '#4CAF50';
    if (this.stats.weeklyFocus >= 60) return '#FF9800';
    return '#F44336';
  }

  trackByNavItem(index: number, item: NavItem): string {
    return item.route;
  }

  getNavItemAriaLabel(item: NavItem): string {
    return item.badge ? `${item.label} (${item.badge} itens)` : item.label;
  }

  refreshStats() {
    // Recarregar estatísticas do servidor
    console.log('Atualizando estatísticas...');
    // Simular atualização
    this.stats = {
      todayEvents: Math.floor(Math.random() * 10),
      pendingTasks: Math.floor(Math.random() * 20),
      completedTasks: Math.floor(Math.random() * 15),
      weeklyFocus: Math.floor(Math.random() * 100)
    };
    this.updateBadges();
  }

  navigateToToday() {
    const today = new Date().toISOString().split('T')[0];
    this.router.navigate(['/app/calendar'], { queryParams: { date: today } });
  }

  navigateToTasks() {
    this.router.navigate(['/app/tasks'], { queryParams: { filter: 'pending' } });
  }

  navigateToProductivity() {
    this.router.navigate(['/app/productivity/dashboard']);
  }

  openNotifications() {
    // Implementar painel de notificações
    console.log('Abrindo notificações');
    // Simular notificações
    this.recentNotifications = [
      {
        id: '1',
        type: 'event',
        title: 'Reunião em 15 minutos',
        timestamp: new Date(),
        read: false
      },
      {
        id: '2', 
        type: 'task',
        title: 'Tarefa vencendo hoje',
        timestamp: new Date(),
        read: false
      }
    ];
  }

  trackByNotification(index: number, notification: any): string {
    return notification.id;
  }

  openNotification(notification: any) {
    // Marcar como lida e navegar
    notification.read = true;
    if (notification.type === 'event') {
      this.router.navigate(['/app/calendar']);
    } else if (notification.type === 'task') {
      this.router.navigate(['/app/tasks']);
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'event': return 'event';
      case 'task': return 'task_alt';
      case 'reminder': return 'alarm';
      default: return 'notifications';
    }
  }

  getUserStatusClass(): string {
    return 'online'; // ou 'offline', 'away', etc.
  }

  getUserStatusText(): string {
    return 'Online';
  }

  openProfile() {
    this.router.navigate(['/app/settings/profile']);
  }

  openSettings() {
    this.router.navigate(['/app/settings']);
  }

  logout() {
    if (confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('loginTime');
      this.router.navigate(['/auth']);
    }
  }

  selectSearchResult(result: any) {
    // Navegar para o resultado selecionado
    if (result.type === 'event') {
      this.router.navigate(['/app/calendar'], { queryParams: { eventId: result.id } });
    } else if (result.type === 'task') {
      this.router.navigate(['/app/tasks'], { queryParams: { taskId: result.id } });
    }
    this.clearSearch();
  }

  trackBySearchResult(index: number, result: any): string {
    return result.id;
  }
}