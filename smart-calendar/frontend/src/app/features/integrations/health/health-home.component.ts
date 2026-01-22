import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';

import { HealthIntegrationService } from '../../../core/services/integrations/health-integration.service';

type Provider = 'googlefit' | 'applehealth';
interface IntegrationStatus {
  googleFit: boolean;
  appleHealth: boolean;
}

@Component({
  selector: 'app-health-home',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './health-home.component.html',
  styleUrls: ['./health-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthHomeComponent implements OnInit {
  private healthService = inject(HealthIntegrationService);
  private cdr = inject(ChangeDetectorRef);

  status: IntegrationStatus = { googleFit: false, appleHealth: false };
  isLoading = false;
  activeAction: Provider | null = null;
  errorMessage = '';

  ngOnInit(): void {
    this.loadStatus();
  }

  get connectedProviders(): number {
    return Number(this.status.googleFit) + Number(this.status.appleHealth);
  }

  loadStatus(): void {
    this.isLoading = true;
    this.healthService
      .getConnectionStatus()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (status) => {
          this.status = status;
          this.errorMessage = '';
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Não foi possível carregar o status das integrações.';
          this.cdr.markForCheck();
        },
      });
  }

  connectGoogleFit(): void {
    this.errorMessage = '';
    this.healthService.connectGoogleFit();
  }

  connectAppleHealth(): void {
    this.activeAction = 'applehealth';
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.healthService
      .connectAppleHealth()
      .pipe(
        finalize(() => {
          this.activeAction = null;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.status.appleHealth = true;
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Não foi possível conectar ao Apple Health.';
          this.cdr.markForCheck();
        },
      });
  }

  disconnect(provider: Provider): void {
    this.activeAction = provider;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.healthService
      .disconnectProvider(provider)
      .pipe(
        finalize(() => {
          this.activeAction = null;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.status[provider === 'googlefit' ? 'googleFit' : 'appleHealth'] = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Falha ao desconectar. Tente novamente.';
          this.cdr.markForCheck();
        },
      });
  }
}
