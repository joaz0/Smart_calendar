import { Component } from '@angular/core';
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
    <aside class="sidebar">
      <nav class="nav-menu">
        <div *ngFor="let item of navItems" class="nav-group">
          <a
            *ngIf="!item.children"
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </a>

          <div *ngIf="item.children" class="nav-section">
            <div class="nav-section-title">{{ item.label }}</div>
            <a
              *ngFor="let child of item.children"
              [routerLink]="child.route"
              routerLinkActive="active"
              class="nav-item nav-item-child"
            >
              <span class="nav-icon">{{ child.icon }}</span>
              <span class="nav-label">{{ child.label }}</span>
            </a>
          </div>
        </div>
      </nav>
    </aside>
  `,
  styleUrls: ['./sidebar.scss'],
})
export class SidebarComponent {
  navItems: NavItem[] = [
    {
      label: 'Calendário',
      icon: '📅',
      route: '/calendar',
    },
    {
      label: 'Eventos',
      icon: '📌',
      route: '/events',
    },
    {
      label: 'Tarefas',
      icon: '✓',
      route: '/tasks',
    },
    {
      label: 'Assistente IA',
      icon: '🤖',
      route: '/ai',
      children: [
        { label: 'Sugestões', icon: '💡', route: '/ai/assistant' },
        { label: 'Agendamento', icon: '🎯', route: '/ai/scheduler' },
        { label: 'Resumo Diário', icon: '📊', route: '/ai/summary' },
        { label: 'Tempo de Viagem', icon: '🚗', route: '/ai/travel' },
      ],
    },
    {
      label: 'Colaboração',
      icon: '👥',
      route: '/collaboration',
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
      route: '/wellness',
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
      route: '/productivity',
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
      route: '/analytics',
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
      route: '/integrations',
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
      route: '/privacy',
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
      route: '/search',
    },
    {
      label: 'Configurações',
      icon: '⚙️',
      route: '/settings',
    },
  ];
}
