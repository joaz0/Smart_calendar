import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

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
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule,
    ThemeToggleComponent
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements OnInit, OnDestroy {
  @Input() user: User = {};
  @Input() notifications = signal(0);
  @Input() isOnline = signal(true);
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() openNotifications = new EventEmitter<void>();
  @Output() openProfile = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();

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
}
