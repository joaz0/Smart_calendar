import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Fechar', {
      duration,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  error(message: string, duration: number = 5000) {
    this.snackBar.open(message, 'Fechar', {
      duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  info(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Fechar', {
      duration,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  warning(message: string, duration: number = 4000) {
    this.snackBar.open(message, 'Fechar', {
      duration,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false,
    };

    const current = this.notifications.value || [];
    this.notifications.next([newNotification, ...current]);

    // mostra snackbar e tenta notificação do navegador
    this.showSnackBar(newNotification.message, newNotification.type);
    this.showBrowserNotification(newNotification);
  }

  markAsRead(notificationId: string) {
    const current = this.notifications.value || [];
    const updated = current.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
    this.notifications.next(updated);
  }

  clearAll() {
    this.notifications.next([]);
  }

  initializeNotifications() {
    // Carregue notificações salvas se necessário
    this.checkPermissions();
  }

  private async checkPermissions() {
    try {
      // A API de Notification pode não existir em todos os ambientes
      const win = window as any;
      if (win && 'Notification' in win) {
        const permission = await win.Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notificações permitidas');
        }
      }
    } catch (e) {
      // não bloquear a aplicação por falhas na API de notificações
      console.warn('Erro ao checar permissões de notificação', e);
    }
  }

  private showBrowserNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    try {
      const win = window as any;
      if (win && 'Notification' in win && win.Notification.permission === 'granted') {
        // eslint-disable-next-line no-new
        new win.Notification(notification.title, {
          body: notification.message,
          icon: '/assets/icons/notification-icon.png',
        });
      }
    } catch (e) {
      // ignore
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private showSnackBar(message: string, type: Notification['type']) {
    this.snackBar.open(message, 'Fechar', {
      duration: type === 'error' ? 5000 : 3000,
      panelClass: [`${type}-snackbar`],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
