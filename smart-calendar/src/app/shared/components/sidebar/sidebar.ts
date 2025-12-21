import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil, filter } from 'rxjs';

const MOBILE_BREAKPOINT = 768;
const STORAGE_KEYS = {
  SIDEBAR_STATE: 'sidebarState',
  TOKEN: 'token',
  LOGIN_TIME: 'loginTime'
} as const;

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
  changeDetection: ChangeDetectionStrategy.OnPush
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

  private destroy$ = new Subject<void>();
  private cachedCompletionPercentage?: number;
  private cachedFocusLevel?: string;
  private cachedFocusColor?: string;

  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/app/dashboard',
    },
    {
      label: 'Calendário',
      icon: 'calendar_today',
      route: '/app/calendar',
      badge: 0,
    },
    {
      label: 'Tarefas',
      icon: 'task_alt',
      route: '/app/tasks',
      badge: 0,
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

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.filteredNavItems = this.navItems;
    this.updateBadges();
    this.subscribeToRouteChanges();
    
    const savedState = localStorage.getItem(STORAGE_KEYS.SIDEBAR_STATE);
    if (savedState) {
      this.isOpen = JSON.parse(savedState);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToRouteChanges(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentActive = event.url;
        this.updateSubmenuStates();
        this.cdr.markForCheck();
      });
  }

  private updateSubmenuStates(): void {
    this.navItems.forEach(item => {
      if (item.children) {
        item.isExpanded = item.children.some(child => this.router.url.includes(child.route));
      }
    });
  }

  updateBadges() {
    const calendarItem = this.navItems.find(item => item.route === '/app/calendar');
    const tasksItem = this.navItems.find(item => item.route === '/app/tasks');
    
    if (calendarItem) calendarItem.badge = this.stats.todayEvents;
    if (tasksItem) tasksItem.badge = this.stats.pendingTasks;
    
    this.invalidateCache();
    this.cdr.markForCheck();
  }

  onToggleSidebar() {
    this.isOpen = !this.isOpen;
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_STATE, JSON.stringify(this.isOpen));
    this.toggleSidebar.emit();
    
    if (!this.isOpen) {
      this.clearSearch();
    }
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredNavItems = this.navItems;
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
    this.filteredNavItems = this.navItems;
  }

  toggleSubmenu(item: NavItem) {
    if (item.children) {
      item.isExpanded = !item.isExpanded;
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      this.isOpen = false;
      this.toggleSidebar.emit();
    }
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  getCompletionPercentage(): number {
    if (this.cachedCompletionPercentage !== undefined) {
      return this.cachedCompletionPercentage;
    }
    const total = this.stats.pendingTasks + this.stats.completedTasks;
    this.cachedCompletionPercentage = total > 0 ? Math.round((this.stats.completedTasks / total) * 100) : 0;
    return this.cachedCompletionPercentage;
  }

  getFocusLevel(): string {
    if (this.cachedFocusLevel) return this.cachedFocusLevel;
    
    const focus = this.stats.weeklyFocus;
    if (focus >= 80) this.cachedFocusLevel = 'Alto';
    else if (focus >= 60) this.cachedFocusLevel = 'Médio';
    else this.cachedFocusLevel = 'Baixo';
    
    return this.cachedFocusLevel;
  }

  getFocusColor(): string {
    if (this.cachedFocusColor) return this.cachedFocusColor;
    
    const focus = this.stats.weeklyFocus;
    if (focus >= 80) this.cachedFocusColor = '#4CAF50';
    else if (focus >= 60) this.cachedFocusColor = '#FF9800';
    else this.cachedFocusColor = '#F44336';
    
    return this.cachedFocusColor;
  }

  private invalidateCache(): void {
    this.cachedCompletionPercentage = undefined;
    this.cachedFocusLevel = undefined;
    this.cachedFocusColor = undefined;
  }

  trackByNavItem(index: number, item: NavItem): string {
    return item.route;
  }

  getNavItemAriaLabel(item: NavItem): string {
    return item.badge ? `${item.label} (${item.badge} itens)` : item.label;
  }

  refreshStats() {
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
    notification.read = true;
    const routes: Record<string, string> = {
      event: '/app/calendar',
      task: '/app/tasks'
    };
    this.router.navigate([routes[notification.type] || '/app/notifications']);
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      event: 'event',
      task: 'task_alt',
      reminder: 'alarm'
    };
    return icons[type] || 'notifications';
  }

  getUserStatusClass(): string {
    return 'online';
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
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.LOGIN_TIME);
      localStorage.removeItem(STORAGE_KEYS.SIDEBAR_STATE);
      this.router.navigate(['/auth']);
    }
  }

  selectSearchResult(result: any) {
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
