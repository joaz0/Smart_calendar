import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  children?: NavItem[];
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="!isOpen">
      <div class="sidebar-header">
        <div class="logo">
          <h2>📅 Smart</h2>
        </div>
      </div>

      <nav class="nav-menu">
        <div *ngFor="let item of navItems" class="nav-group">
          <a
            *ngIf="!item.children"
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
            [class.active]="isActiveRoute(item.route)"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label" *ngIf="isOpen">{{ item.label }}</span>
          </a>

          <div *ngIf="item.children" class="nav-section">
            <div class="nav-section-title" *ngIf="isOpen">{{ item.label }}</div>
            <a
              *ngFor="let child of item.children"
              [routerLink]="child.route"
              routerLinkActive="active"
              class="nav-item nav-item-child"
            >
              <span class="nav-icon">{{ child.icon }}</span>
              <span class="nav-label" *ngIf="isOpen">{{ child.label }}</span>
            </a>
          </div>
        </div>
      </nav>

      <div class="sidebar-stats" *ngIf="isOpen">
        <div class="stat-item">
          <span class="stat-icon">📅</span>
          <div class="stat-info">
            <strong>{{ stats.eventsToday || 0 }}</strong>
            <small>Eventos hoje</small>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">✓</span>
          <div class="stat-info">
            <strong>{{ stats.pendingTasks || 0 }}</strong>
            <small>Tarefas pendentes</small>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">⚡</span>
          <div class="stat-info">
            <strong>{{ stats.productivity || 0 }}%</strong>
            <small>Produtividade</small>
          </div>
        </div>
      </div>

      <div class="user-profile" *ngIf="isOpen">
        <div class="user-avatar">{{ user.avatar || '👤' }}</div>
        <div class="user-info">
          <strong>{{ user.name || 'Usuário' }}</strong>
          <small>{{ user.email || '' }}</small>
        </div>
      </div>
    </aside>
  `,
  styleUrls: ['./sidebar.scss'],
})
export class SidebarComponent {
  @Input() isOpen: boolean = true;
  @Input() currentActive: string = 'calendar';
  @Input() stats: any = {};
  @Input() user: any = {};

  navItems: NavItem[] = [
    {
      label: 'Calendário',
      icon: '📅',
      route: '/app/calendar',
    },
    {
      label: 'Eventos',
      icon: '📌',
      route: '/app/events',
    },
    {
      label: 'Tarefas',
      icon: '✓',
      route: '/app/tasks',
    },
    {
      label: 'Assistente IA',
      icon: '🤖',
      route: '/app/ai-assistant',
    },
    {
      label: 'Colaboração',
      icon: '👥',
      route: '/app/collaboration',
      children: [
        { label: 'Dashboard', icon: '📊', route: '/collaboration/dashboard' },
        { label: 'Time', icon: '👨‍👩‍👧‍👦', route: '/collaboration/team-calendar' },
        { label: 'Disponibilidade', icon: '🟢', route: '/collaboration/availability' },
        { label: 'Enquetes', icon: '📋', route: '/collaboration/polls' },
      ],
    },
    {
      label: 'Bem-estar',
      icon: '💚',
      route: '/app/wellness',
      children: [
        { label: 'Dashboard', icon: '📊', route: '/wellness/dashboard' },
        { label: 'Burnout', icon: '🔥', route: '/wellness/burnout' },
        { label: 'Pausas', icon: '☕', route: '/wellness/breaks' },
        { label: 'Relaxamento', icon: '🌙', route: '/wellness/wind-down' },
      ],
    },
    {
      label: 'Produtividade',
      icon: '⚡',
      route: '/app/productivity',
      children: [
        { label: 'Insights', icon: '📈', route: '/productivity/insights' },
        { label: 'Foco', icon: '🎯', route: '/productivity/focus' },
        { label: 'Hábitos', icon: '🔄', route: '/productivity/habits' },
        { label: 'Templates', icon: '📝', route: '/productivity/templates' },
      ],
    },
    {
      label: 'Analytics',
      icon: '📊',
      route: '/app/analytics',
      children: [
        { label: 'Tempo', icon: '⏱️', route: '/analytics/time' },
        { label: 'Energia', icon: '⚡', route: '/analytics/energy' },
        { label: 'Insights', icon: '💡', route: '/analytics/insights' },
        { label: 'Relacionamentos', icon: '🔗', route: '/analytics/relationships' },
        { label: 'Projetos', icon: '📅', route: '/analytics/projects' },
      ],
    },
    {
      label: 'Integrações',
      icon: '🔌',
      route: '/app/integrations',
      children: [
        { label: 'Contatos', icon: '👤', route: '/integrations/contacts' },
        { label: 'Documentos', icon: '📄', route: '/integrations/documents' },
        { label: 'Saúde', icon: '❤️', route: '/integrations/health' },
        { label: 'Vídeo', icon: '🎥', route: '/integrations/video' },
      ],
    },
    {
      label: 'Privacidade',
      icon: '🔒',
      route: '/app/privacy',
      children: [
        { label: 'Centro', icon: '🛡️', route: '/privacy/center' },
        { label: 'Calendários', icon: '📅', route: '/privacy/calendars' },
        { label: 'Backup', icon: '💾', route: '/privacy/backup' },
        { label: 'Herança Digital', icon: '🔑', route: '/privacy/inheritance' },
      ],
    },
    {
      label: 'Busca',
      icon: '🔍',
      route: '/app/search',
    },
    {
      label: 'Configurações',
      icon: '⚙️',
      route: '/app/settings',
    },
  ];

  isActiveRoute(route: string): boolean {
    const routeMap: { [key: string]: string } = {
      '/app/calendar': 'calendar',
      '/app/tasks': 'tasks',
      '/app/ai-assistant': 'ai',
      '/app/productivity': 'productivity',
    };
    return routeMap[route] === this.currentActive;
  }
}
