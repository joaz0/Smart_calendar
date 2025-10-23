import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
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
  @Input() user: any = {};
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() searchQuery = new EventEmitter<string>();

  searchTerm: string = '';
  notifications: number = 3;
  filteredNavItems: NavItem[] = [];

  constructor(private router: Router) {}

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-home',
      route: '/app/dashboard',
    },
    {
      label: 'Calendário',
      icon: 'fas fa-calendar-alt',
      route: '/app/calendar',
      badge: this.stats.todayEvents,
    },
    {
      label: 'Tarefas',
      icon: 'fas fa-check-circle',
      route: '/app/tasks',
      badge: this.stats.pendingTasks,
    },
    {
      label: 'Eventos',
      icon: 'fas fa-bookmark',
      route: '/app/events',
    },
    {
      label: 'Assistente IA',
      icon: 'fas fa-robot',
      route: '/app/ai-assistant',
    },
    {
      label: 'Colaboração',
      icon: 'fas fa-users',
      route: '/app/collaboration',
      isExpanded: false,
      children: [
        { label: 'Dashboard', icon: 'fas fa-chart-bar', route: '/app/collaboration/dashboard' },
        { label: 'Equipe', icon: 'fas fa-user-friends', route: '/app/collaboration/team' },
        { label: 'Disponibilidade', icon: 'fas fa-circle', route: '/app/collaboration/availability' },
        { label: 'Reuniões', icon: 'fas fa-video', route: '/app/collaboration/meetings' },
      ],
    },
    {
      label: 'Produtividade',
      icon: 'fas fa-bolt',
      route: '/app/productivity',
      isExpanded: false,
      children: [
        { label: 'Foco', icon: 'fas fa-bullseye', route: '/app/productivity/focus' },
        { label: 'Hábitos', icon: 'fas fa-sync-alt', route: '/app/productivity/habits' },
        { label: 'Templates', icon: 'fas fa-file-alt', route: '/app/productivity/templates' },
        { label: 'Pomodoro', icon: 'fas fa-clock', route: '/app/productivity/pomodoro' },
      ],
    },
    {
      label: 'Bem-estar',
      icon: 'fas fa-heart',
      route: '/app/wellness',
      isExpanded: false,
      children: [
        { label: 'Dashboard', icon: 'fas fa-chart-line', route: '/app/wellness/dashboard' },
        { label: 'Pausas', icon: 'fas fa-coffee', route: '/app/wellness/breaks' },
        { label: 'Meditação', icon: 'fas fa-leaf', route: '/app/wellness/meditation' },
        { label: 'Sono', icon: 'fas fa-moon', route: '/app/wellness/sleep' },
      ],
    },
    {
      label: 'Analytics',
      icon: 'fas fa-chart-pie',
      route: '/app/analytics',
      isExpanded: false,
      children: [
        { label: 'Tempo', icon: 'fas fa-stopwatch', route: '/app/analytics/time' },
        { label: 'Produtividade', icon: 'fas fa-chart-line', route: '/app/analytics/productivity' },
        { label: 'Insights', icon: 'fas fa-lightbulb', route: '/app/analytics/insights' },
        { label: 'Relatórios', icon: 'fas fa-clipboard-list', route: '/app/analytics/reports' },
      ],
    },
    {
      label: 'Integrações',
      icon: 'fas fa-plug',
      route: '/app/integrations',
    },
    {
      label: 'Configurações',
      icon: 'fas fa-cog',
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
}