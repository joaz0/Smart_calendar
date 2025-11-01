import { Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  actionCallback?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications = signal<Notification[]>([]);
  unreadCount = signal(0);

  constructor(private snackBar: MatSnackBar) {}

  initializeNotifications() {
    // Load notifications from localStorage or API
    this.loadNotifications();
  }

  private loadNotifications() {
    // Mock notifications for demo
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Reunião em 15 minutos',
        message: 'Reunião de equipe às 14:00',
        type: 'info',
        timestamp: new Date(),
        read: false
      },
      {
        id: '2',
        title: 'Tarefa vencendo',
        message: 'Relatório mensal vence hoje',
        type: 'warning',
        timestamp: new Date(Date.now() - 3600000),
        read: false
      }
    ];
    
    this.notifications.set(mockNotifications);
    this.updateUnreadCount();
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    this.notifications.update(notifications => [newNotification, ...notifications]);
    this.updateUnreadCount();
    
    // Show snackbar
    this.showSnackbar(newNotification);
  }

  markAsRead(id: string) {
    this.notifications.update(notifications =>
      notifications.map(n => n.id === id ? { ...n, read: true } : n)
    );
    this.updateUnreadCount();
  }

  markAllAsRead() {
    this.notifications.update(notifications =>
      notifications.map(n => ({ ...n, read: true }))
    );
    this.updateUnreadCount();
  }

  removeNotification(id: string) {
    this.notifications.update(notifications =>
      notifications.filter(n => n.id !== id)
    );
    this.updateUnreadCount();
  }

  clearAll() {
    this.notifications.set([]);
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    const unread = this.notifications().filter(n => !n.read).length;
    this.unreadCount.set(unread);
  }

  private showSnackbar(notification: Notification) {
    const config = {
      duration: 5000,
      horizontalPosition: 'right' as const,
      verticalPosition: 'top' as const,
      panelClass: [`snackbar-${notification.type}`]
    };

    const snackBarRef = this.snackBar.open(
      `${notification.title}: ${notification.message}`,
      notification.actionLabel || 'Fechar',
      config
    );

    if (notification.actionCallback) {
      snackBarRef.onAction().subscribe(() => {
        notification.actionCallback!();
      });
    }
  }

  // Utility methods for common notifications
  showSuccess(message: string, title = 'Sucesso') {
    this.addNotification({
      title,
      message,
      type: 'success'
    });
  }

  showError(message: string, title = 'Erro') {
    this.addNotification({
      title,
      message,
      type: 'error'
    });
  }

  showWarning(message: string, title = 'Atenção') {
    this.addNotification({
      title,
      message,
      type: 'warning'
    });
  }

  showInfo(message: string, title = 'Informação') {
    this.addNotification({
      title,
      message,
      type: 'info'
    });
  }
}