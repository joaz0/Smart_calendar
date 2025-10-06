// src/app/layouts/main-layout/main-layout.component.ts
import { Component, HostListener } from '@angular/core';

interface Activity {
  id: string;
  title: string;
  icon: string;
}

interface CalendarView {
  id: string;
  name: string;
}

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  // State Management
  isActivityBarCollapsed = false;
  currentActivity: string = 'calendar';
  currentView: string = 'month';
  showCommandPalette = false;
  currentDate = new Date();

  // Activities (VS Code style)
  activities: Activity[] = [
    { id: 'calendar', title: 'Calendário', icon: '📅' },
    { id: 'tasks', title: 'Tarefas', icon: '✅' },
    { id: 'ai', title: 'AI Assistant', icon: '🤖' },
    { id: 'productivity', title: 'Produtividade', icon: '⚡' },
    { id: 'collaboration', title: 'Colaboração', icon: '👥' },
    { id: 'wellness', title: 'Bem-estar', icon: '💚' },
    { id: 'analytics', title: 'Analytics', icon: '📊' }
  ];

  // Calendar Views (VS Code tabs style)
  calendarViews: CalendarView[] = [
    { id: 'day', name: 'Dia' },
    { id: 'week', name: 'Semana' },
    { id: 'month', name: 'Mês' },
    { id: 'agenda', name: 'Agenda' }
  ];

  // Keyboard Shortcuts (VS Code inspired)
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Ctrl/Cmd + K for command palette
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.toggleCommandPalette();
    }

    // Escape to close modals
    if (event.key === 'Escape') {
      this.hideCommandPalette();
    }
  }

  // Activity Management
  setActivity(activityId: string) {
    this.currentActivity = activityId;
    if (this.isActivityBarCollapsed) {
      this.isActivityBarCollapsed = false;
    }
  }

  toggleActivityBar() {
    this.isActivityBarCollapsed = !this.isActivityBarCollapsed;
  }

  closeSidebar() {
    this.currentActivity = '';
  }

  getActivityTitle(): string {
    const activity = this.activities.find(a => a.id === this.currentActivity);
    return activity ? activity.title : '';
  }

  // View Management
  setView(viewId: string) {
    this.currentView = viewId;
  }

  // Command Palette (VS Code style)
  toggleCommandPalette() {
    this.showCommandPalette = !this.showCommandPalette;
  }

  hideCommandPalette() {
    this.showCommandPalette = false;
  }

  // User Management
  getUserInitials(): string {
    // Mock user data - replace with actual user service
    return 'UL';
  }
}