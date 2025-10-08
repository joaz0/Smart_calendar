import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from './core/services/loading.service';
import { NotificationService } from './core/services/notification.service';
import { ThemeService } from './core/services/theme.service';
import { ApiMapperInitService } from './core/services/api-mapper-init.service';
import { environment } from '../environments/environment';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatProgressSpinnerModule],
})
export class AppComponent implements OnInit {
  isLoading$ = new BehaviorSubject<boolean>(false);

  env = environment;
  currentRoute = '';

  constructor(
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private themeService: ThemeService,
    private apiMapperInit: ApiMapperInitService
  ) {}

  ngOnInit() {
    // Inscreve no serviço de loading global
    this.loadingService.isLoading$.subscribe((isLoading) => this.isLoading$.next(isLoading));

    // Inicializa o tema
    this.themeService.initializeTheme();

    // Configura os listeners de notificação
    this.notificationService.initializeNotifications();
  }
}
