import { Component, OnInit, OnDestroy, inject } from '@angular/core.component';

import { FormsModule } from '@angular/forms.component';
import { MatCardModule } from '@angular/material/card.component';
import { MatButtonModule } from '@angular/material/button.component';
import { MatIconModule } from '@angular/material/icon.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle.component';
import { MatSelectModule } from '@angular/material/select.component';
import { MatDividerModule } from '@angular/material/divider.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner.component';
import { Subject, takeUntil } from 'rxjs';
import { PrivacyService, PrivacySettings, DataAccessLog } from '../../../core/services/privacy/privacy.service';

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
  templateUrl: './privacy-control-center.html',
  styleUrl: './privacy-control-center.scss'
})
export class PrivacyControlCenterComponent implements OnInit, OnDestroy {
  private privacyService = inject(PrivacyService);

  private destroy$ = new Subject<void>();
  
  settings: PrivacySettings | null = null;
  accessLogs: DataAccessLog[] = [];
  loading = false;

  ngOnInit() {
    this.privacyService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => this.settings = settings);
    
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
}
