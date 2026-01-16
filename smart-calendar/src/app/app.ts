import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subject, fromEvent, merge, of } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { LoadingService } from './core/services/loading.service';
import { NotificationService, Notification } from './core/services/notification.service';
import { ThemeService } from './core/services/theme.service';
import { ApiMapperInitService } from './core/services/api-mapper-init.service';
import { environment } from '../environments/environment';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoadingSpinner } from './shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatProgressSpinnerModule, MatIconModule, MatButtonModule, LoadingSpinner],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isLoading$ = new BehaviorSubject<boolean>(false);
  isDarkTheme = false;
  isGlobalLoading = false;
  toastNotifications: Notification[] = [];
  showPwaUpdate = false;
  isOnline = true;

  env = environment;
  currentRoute = '';

  constructor(
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private themeService: ThemeService,
    private apiMapperInit: ApiMapperInitService
  ) {}

  ngOnInit() {
    this.loadingService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        this.isLoading$.next(isLoading);
        this.isGlobalLoading = isLoading;
      });

    this.themeService.isDarkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDark: boolean) => this.isDarkTheme = isDark);

    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications: Notification[]) => {
        this.toastNotifications = notifications.filter((n: Notification) => !n.read).slice(0, 3);
      });

    this.themeService.initializeTheme();
    this.setupOnlineDetection();
    this.checkForPwaUpdate();
  }

  private setupOnlineDetection() {
    if (typeof window === 'undefined') return;
    
    merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOnline => this.isOnline = isOnline);
  }

  private checkForPwaUpdate() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showPwaUpdate = true;
              }
            });
          }
        });
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByNotification(index: number, notification: any): string {
    return notification.id;
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'notifications';
    }
  }

  dismissNotification(id: string): void {
    this.notificationService.markAsRead(id);
  }

  dismissPwaUpdate(): void {
    this.showPwaUpdate = false;
    localStorage.setItem('pwa-update-dismissed', Date.now().toString());
  }

  updatePwa(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  }
}
