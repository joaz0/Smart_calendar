import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { SearchBar } from '../search-bar/search-bar';

interface User {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
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
    ThemeToggleComponent,
    SearchBar
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements OnInit, OnDestroy {
  @Input() user: User = {};
  @Input() sidebarOpen = true;
  @Input() notifications = signal(0);
  @Input() isOnline = signal(true);
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() themeToggle = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();
  @Output() notificationsClick = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() openNotifications = new EventEmitter<void>();
  @Output() openProfile = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();
  
  breadcrumbs: any[] = [];
  isDarkTheme = false;
  notificationCount = 0;

  currentTime = signal(new Date());
  greeting = signal('');
  private timeInterval?: number;

  ngOnInit() {
    this.updateTime();
    this.updateGreeting();
    this.timeInterval = window.setInterval(() => {
      this.updateTime();
      this.updateGreeting();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateTime() {
    this.currentTime.set(new Date());
  }

  private updateGreeting() {
    const hour = new Date().getHours();
    let greetingText = '';
    
    if (hour < 12) {
      greetingText = 'Bom dia';
    } else if (hour < 18) {
      greetingText = 'Boa tarde';
    } else {
      greetingText = 'Boa noite';
    }
    
    this.greeting.set(greetingText);
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onLogout() {
    this.logout.emit();
  }

  onOpenNotifications() {
    this.openNotifications.emit();
  }

  onOpenProfile() {
    this.openProfile.emit();
  }

  onToggleTheme() {
    this.toggleTheme.emit();
  }

  getUserInitials(): string {
    if (!this.user.name) return 'U';
    return this.user.name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getConnectionStatus(): string {
    return this.isOnline() ? 'Online' : 'Offline';
  }

  onSearch(query: string): void {
    // Implementar busca global
    if (query.trim()) {
      // Navegar para página de resultados ou filtrar conteúdo atual
      console.log('Buscando por:', query);
    }
  }

  createEvent(): void {
    // Abrir modal de criação de evento
    import('../../../features/calendar/event-dialog/event-dialog').then(m => {
      // Implementar abertura do modal
      console.log('Abrindo modal de evento');
    });
  }

  createTask(): void {
    // Abrir modal de criação de tarefa
    import('../../../features/tasks/task-form/task-form').then(m => {
      console.log('Abrindo modal de tarefa');
    });
  }

  createReminder(): void {
    // Criar lembrete rápido
    const title = prompt('Digite o lembrete:');
    if (title) {
      console.log('Criando lembrete:', title);
      // Implementar criação de lembrete
    }
  }

  importCalendar(): void {
    // Abrir seletor de arquivo para importar calendário
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.ics,.csv';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        console.log('Importando calendário:', file.name);
        // Implementar importação
      }
    };
    input.click();
  }

  openSettings(): void {
    // Navegar para configurações
    window.location.href = '/app/settings';
  }

  openHelp(): void {
    // Abrir página de ajuda
    window.open('https://help.agendarapido.com', '_blank');
  }
}
