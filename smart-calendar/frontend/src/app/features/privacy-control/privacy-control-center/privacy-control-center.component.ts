import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { PrivacyService, PrivacySettings, DataAccessLog } from '../../../core/services/privacy/privacy.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-privacy-control-center',
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule
],
  templateUrl: './privacy-control-center.component.html',
  styleUrl: './privacy-control-center.component.scss'
})
export class PrivacyControlCenterComponent implements OnInit, OnDestroy {
  private privacyService = inject(PrivacyService);
  private authService = inject(AuthService);

  private destroy$ = new Subject<void>();
  
  settings: PrivacySettings | null = null;
  accessLogs: DataAccessLog[] = [];
  loading = false;
  isDemoUser = false;

  ngOnInit() {
    this.privacyService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => this.settings = settings);

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.isDemoUser = user?.email === 'demo@smartcalendar.app');
    
    this.loadAccessLogs();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAccessLogs() {
    this.privacyService.getAccessLogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe(logs => this.accessLogs = logs);
  }

  updateSettings() {
    if (this.settings) {
      this.privacyService.updateSettings(this.settings)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  exportData() {
    this.loading = true;
    this.privacyService.exportData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `data-export-${new Date().toISOString().split('T')[0]}.json`;
          link.click();
          this.loading = false;
        },
        error: () => {
          alert('Export não disponível no momento');
          this.loading = false;
        }
      });
  }

  deleteAccount() {
    if (this.isDemoUser) {
      alert('⚠️ Esta ação está bloqueada no modo demonstração.');
      return;
    }

    if (confirm('ATENÇÃO: Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos. Tem certeza?')) {
      this.privacyService.deleteAccount()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => alert('Conta excluída com sucesso'),
          error: () => alert('Erro ao excluir conta')
        });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('pt-BR');
  }

  getActionIcon(action: string): string {
    switch (action) {
      case 'read': return 'visibility';
      case 'write': return 'edit';
      case 'delete': return 'delete';
      case 'share': return 'share';
      default: return 'info';
    }
  }

  applyPreset(preset: 'estrito' | 'colaborativo'): void {
    if (!this.settings) return;
    const nextSettings: PrivacySettings = { ...this.settings };

    if (preset === 'estrito') {
      nextSettings.dataSharing = false;
      nextSettings.analyticsTracking = false;
      nextSettings.locationTracking = false;
      nextSettings.notificationPreferences = { email: true, push: false, sms: false };
      nextSettings.visibilitySettings = { calendar: 'private', tasks: 'private', profile: 'private' };
    } else {
      nextSettings.dataSharing = true;
      nextSettings.analyticsTracking = true;
      nextSettings.locationTracking = false;
      nextSettings.notificationPreferences = { email: true, push: true, sms: false };
      nextSettings.visibilitySettings = { calendar: 'team', tasks: 'team', profile: 'private' };
    }

    this.settings = nextSettings;
    this.updateSettings();
  }

  get privacyScore(): number {
    if (!this.settings) return 0;
    let score = 100;
    if (this.settings.dataSharing) score -= 20;
    if (this.settings.analyticsTracking) score -= 8;
    if (this.settings.locationTracking) score -= 18;
    if (this.settings.visibilitySettings.calendar !== 'private') score -= 8;
    if (this.settings.visibilitySettings.tasks !== 'private') score -= 6;
    if (this.settings.visibilitySettings.profile !== 'private') score -= 6;
    return Math.max(0, score);
  }

  get privacyLevel(): 'alta' | 'media' | 'baixa' {
    if (this.privacyScore >= 75) return 'alta';
    if (this.privacyScore >= 50) return 'media';
    return 'baixa';
  }

  get lastLog(): DataAccessLog | undefined {
    return this.accessLogs[0];
  }
}
