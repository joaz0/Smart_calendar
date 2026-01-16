import { Component, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HealthIntegrationService } from '../../../core/services/integrations/health-integration.service';

@Component({
  selector: 'app-health-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="health-container">
      <h1><mat-icon>favorite</mat-icon> Integração de Saúde</h1>
    
      <mat-card>
        <mat-card-header>
          <mat-card-title>Google Fit</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Sincronize seus dados de atividade e sono</p>
          @if (!status.googleFit) {
            <button mat-raised-button color="primary"
              (click)="connectGoogleFit()">
              Conectar Google Fit
            </button>
          }
          @if (status.googleFit) {
            <button mat-raised-button color="warn"
              (click)="disconnect('googlefit')">
              Desconectar
            </button>
          }
        </mat-card-content>
      </mat-card>
    
      <mat-card>
        <mat-card-header>
          <mat-card-title>Apple Health</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Sincronize seus dados de saúde do iPhone</p>
          @if (!status.appleHealth) {
            <button mat-raised-button color="primary"
              (click)="connectAppleHealth()">
              Conectar Apple Health
            </button>
          }
          @if (status.appleHealth) {
            <button mat-raised-button color="warn"
              (click)="disconnect('applehealth')">
              Desconectar
            </button>
          }
        </mat-card-content>
      </mat-card>
    </div>
    `,
  styles: [`
    .health-container { padding: 2rem; max-width: 800px; margin: 0 auto; }
    h1 { display: flex; align-items: center; gap: 0.5rem; }
    mat-card { margin-bottom: 1rem; }
  `]
})
export class HealthHomeComponent implements OnInit {
  status = { googleFit: false, appleHealth: false };

  constructor(private healthService: HealthIntegrationService) {}

  ngOnInit() {
    this.healthService.getConnectionStatus().subscribe(
      status => this.status = status
    );
  }

  connectGoogleFit() {
    this.healthService.connectGoogleFit();
  }

  connectAppleHealth() {
    this.healthService.connectAppleHealth().subscribe();
  }

  disconnect(provider: 'googlefit' | 'applehealth') {
    this.healthService.disconnectProvider(provider).subscribe(
      () => this.status[provider === 'googlefit' ? 'googleFit' : 'appleHealth'] = false
    );
  }
}
