import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  computed,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

interface User {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
}

interface Notification {
  id: string;
  title: string;
  message?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
  action?: () => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  callback: () => void;
  disabled?: boolean;
}

interface Breadcrumb {
  label: string;
  route?: string;
  icon?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule,
    MatRippleModule
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements OnInit, OnDestroy {
  // Configurações básicas
  @Input() user: User = {
    name: 'Usuário',
    email: 'user@example.com',
    status: 'online'
  };
  @Input() sidebarOpen = true;
  @Input() showSearch = true;
  @Input() showNotifications = true;
  @Input() showQuickActions = true;
  @Input() showBreadcrumbs = true;
  @Input() showUserMenu = true;
  @Input() sticky = true;

  // Dados
  @Input() notifications: Notification[] = [];
  @Input() quickActions: QuickAction[] = [];
  @Input() breadcrumbs: Breadcrumb[] = [];

  // Eventos
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() themeToggle = new EventEmitter<void>();
  @Output() notificationClick = new EventEmitter<Notification>();
  @Output() searchQuery = new EventEmitter<string>();
  @Output() profileClick = new EventEmitter<void>();
  @Output() settingsClick = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() quickActionExecuted = new EventEmitter<QuickAction>();

  // Signals
  currentTime = signal(new Date());
  greeting = signal('');
  isOnline = signal(navigator.onLine);
  unreadCount = computed(() =>
    this.notifications.filter(n => !n.read).length
  );

  // Estados internos
  isDarkTheme = false;
  showNotificationsPanel = false;
  isScrolled = false;

  private destroy$ = new Subject<void>();
  private timeInterval?: number;
  private onlineSubscription?: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateTime();
    this.updateGreeting();
    this.loadThemePreference();
    this.setupTimeUpdater();
    this.setupOnlineDetection();
    this.setupScrollDetection();
    this.setupRouteListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private setupTimeUpdater(): void {
    this.timeInterval = window.setInterval(() => {
      this.updateTime();
      this.updateGreeting();
    }, 60000); // Atualizar a cada minuto
  }

  private setupOnlineDetection(): void {
    window.addEventListener('online', () => {
      this.isOnline.set(true);
      this.cdr.markForCheck();
    });

    window.addEventListener('offline', () => {
      this.isOnline.set(false);
      this.cdr.markForCheck();
    });
  }

  private setupScrollDetection(): void {
    if (!this.sticky) return;

    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 10;
      this.cdr.markForCheck();
    });
  }

  private setupRouteListener(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateBreadcrumbs();
        this.cdr.markForCheck();
      });
  }

  private updateTime(): void {
    this.currentTime.set(new Date());
  }

  private updateGreeting(): void {
    const hour = new Date().getHours();
    let greetingText = '';

    if (hour < 5) {
      greetingText = 'Boa madrugada';
    } else if (hour < 12) {
      greetingText = 'Bom dia';
    } else if (hour < 18) {
      greetingText = 'Boa tarde';
    } else {
      greetingText = 'Boa noite';
    }

    this.greeting.set(greetingText);
  }

  private updateBreadcrumbs(): void {
    // Gerar breadcrumbs baseado na rota atual
    const url = this.router.url;
    const segments = url.split('/').filter(s => s);

    this.breadcrumbs = segments.map((segment, index) => ({
      label: this.formatSegmentLabel(segment),
      route: '/' + segments.slice(0, index + 1).join('/')
    }));
  }

  private formatSegmentLabel(segment: string): string {
    return segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private loadThemePreference(): void {
    const saved = localStorage.getItem('theme');
    this.isDarkTheme = saved === 'dark';
  }

  private saveThemePreference(): void {
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  // Ações do header
  onToggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  onToggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.saveThemePreference();
    this.themeToggle.emit();
    this.cdr.markForCheck();
  }

  onNotificationClick(notification: Notification): void {
    notification.read = true;
    this.notificationClick.emit(notification);

    if (notification.action) {
      notification.action();
    }

    this.cdr.markForCheck();
  }

  markAllNotificationsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.cdr.markForCheck();
  }

  clearAllNotifications(): void {
    this.notifications = [];
    this.cdr.markForCheck();
  }

  onSearch(query: string): void {
    this.searchQuery.emit(query);
  }

  executeQuickAction(action: QuickAction): void {
    if (action.disabled) return;

    action.callback();
    this.quickActionExecuted.emit(action);
  }

  onOpenProfile(): void {
    this.profileClick.emit();
    this.router.navigate(['/app/settings/profile']);
  }

  onOpenSettings(): void {
    this.settingsClick.emit();
    this.router.navigate(['/app/settings']);
  }

  onLogout(): void {
    if (confirm('Tem certeza que deseja sair?')) {
      // Limpar dados locais
      localStorage.removeItem('token');
      localStorage.removeItem('loginTime');

      this.logout.emit();
      this.router.navigate(['/auth/login']);
    }
  }

  // Navegação breadcrumb
  navigateToBreadcrumb(breadcrumb: Breadcrumb): void {
    if (breadcrumb.route) {
      this.router.navigate([breadcrumb.route]);
    }
  }

  // Helpers UI
  getUserInitials(): string {
    if (!this.user.name) return 'U';

    const names = this.user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return this.user.name.substring(0, 2).toUpperCase();
  }

  getUserStatusClass(): string {
    return `status-${this.user.status || 'offline'}`;
  }

  getUserStatusText(): string {
    const statusMap: Record<string, string> = {
      online: 'Online',
      away: 'Ausente',
      busy: 'Ocupado',
      offline: 'Offline'
    };
    return statusMap[this.user.status || 'offline'];
  }

  getNotificationIcon(type: string): string {
    const iconMap: Record<string, string> = {
      info: 'info',
      success: 'check_circle',
      warning: 'warning',
      error: 'error'
    };
    return iconMap[type] || 'notifications';
  }

  getNotificationClass(type: string): string {
    return `notification-${type}`;
  }

  getFormattedTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  }

  getHeaderClass(): string {
    const classes = ['app-header'];

    if (this.sticky) classes.push('sticky');
    if (this.isScrolled) classes.push('scrolled');
    if (this.isDarkTheme) classes.push('dark');

    return classes.join(' ');
  }

  // Quick actions predefinidas
  getDefaultQuickActions(): QuickAction[] {
    return [
      {
        id: 'new-event',
        label: 'Novo Evento',
        icon: 'event',
        shortcut: 'Ctrl+N',
        callback: () => this.createEvent()
      },
      {
        id: 'new-task',
        label: 'Nova Tarefa',
        icon: 'task_alt',
        shortcut: 'Ctrl+T',
        callback: () => this.createTask()
      },
      {
        id: 'import',
        label: 'Importar',
        icon: 'upload_file',
        callback: () => this.importCalendar()
      }
    ];
  }

  private createEvent(): void {
    console.log('Criando evento...');
    // Implementar abertura de modal
  }

  private createTask(): void {
    console.log('Criando tarefa...');
    // Implementar abertura de modal
  }

  private importCalendar(): void {
    console.log('Importando calendário...');
    // Implementar importação
  }

  // Atalhos de teclado
  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    // Ctrl/Cmd + K para busca
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      const searchInput = document.querySelector<HTMLInputElement>('.search-input');
      searchInput?.focus();
    }

    // Ctrl/Cmd + / para atalhos
    if ((event.ctrlKey || event.metaKey) && event.key === '/') {
      event.preventDefault();
      // Abrir painel de atalhos
    }
  }

  // TrackBy
  trackByNotification(index: number, notification: Notification): string {
    return notification.id;
  }

  trackByAction(index: number, action: QuickAction): string {
    return action.id;
  }

  trackByBreadcrumb(index: number, breadcrumb: Breadcrumb): string {
    return breadcrumb.route || breadcrumb.label;
  }
}
