import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingService } from './core/services/loading.service';
import { NotificationService } from './core/services/notification.service';
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
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isLoading$ = new BehaviorSubject<boolean>(false);
  isDarkTheme = false;
  isGlobalLoading = false;
  toastNotifications: any[] = [];
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
      .subscribe((isLoading) => this.isLoading$.next(isLoading));

    this.themeService.initializeTheme();
    this.notificationService.initializeNotifications();
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
    this.toastNotifications = this.toastNotifications.filter(n => n.id !== id);
  }

  dismissPwaUpdate(): void {
    this.showPwaUpdate = false;
  }

  updatePwa(): void {
    // Implementar atualização PWA
  }
}
