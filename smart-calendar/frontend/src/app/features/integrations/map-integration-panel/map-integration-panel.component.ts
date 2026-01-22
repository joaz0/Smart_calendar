import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapIntegrationService } from '../../../core/services/integrations/map-integration.service';
import { Subscription } from 'rxjs';

// Interface para tipagem segura dos dados do mapa (Mock inicial)
interface LocationData {
  id: string;
  name: string;
  coords: { lat: number; lng: number };
  type: 'home' | 'work' | 'event';
}

@Component({
  selector: 'app-map-integration-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-integration-panel.component.html',
  styleUrls: ['./map-integration-panel.component.scss']
})
export class MapIntegrationPanelComponent implements OnInit, OnDestroy {
  isLoading = true;
  hasError = false;
  errorMessage = '';

  // Dados simulados para visualização inicial
  activeLocations: LocationData[] = [];

  private subscription: Subscription = new Subscription();

  constructor(private mapService: MapIntegrationService) {}

  ngOnInit(): void {
    this.loadMapData();
  }

  loadMapData(): void {
    this.isLoading = true;
    this.hasError = false;

    // Simulação de carregamento de dados (substituir pela chamada real do serviço depois)
    setTimeout(() => {
      try {
        this.activeLocations = [
          { id: '1', name: 'Escritório Central', coords: { lat: -23.5505, lng: -46.6333 }, type: 'work' },
          { id: '2', name: 'Casa', coords: { lat: -23.5605, lng: -46.6433 }, type: 'home' }
        ];
        this.isLoading = false;
      } catch (err) {
        this.handleError('Falha ao carregar dados do mapa.');
      }
    }, 1500);
  }

  retryConnection(): void {
    this.loadMapData();
  }

  private handleError(msg: string): void {
    this.hasError = true;
    this.errorMessage = msg;
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
