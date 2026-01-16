import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Location {
  id?: string;
  name: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  placeId?: string;
}

export interface DirectionsResult {
  routes: Route[];
  distance: number;
  duration: number;
}

export interface Route {
  summary: string;
  legs: RouteLeg[];
  distance: number;
  duration: number;
  trafficDelay?: number;
}

export interface RouteLeg {
  startAddress: string;
  endAddress: string;
  distance: number;
  duration: number;
  steps: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
}

export interface NearbyPlace {
  name: string;
  address: string;
  rating?: number;
  type: string;
  distance: number;
}

@Injectable({
  providedIn: 'root'
})
export class MapIntegrationService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/integrations/maps`;

  constructor(private http: HttpClient) {}

  searchLocation(query: string): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/search`, { params: { q: query } }).pipe(
      catchError(() => of(this.getMockLocations()))
    );
  }

  geocode(address: string): Observable<{ lat: number; lng: number }> {
    return this.http.post<any>(`${this.apiUrl}/geocode`, { address }).pipe(
      catchError(() => of({ lat: -23.5505, lng: -46.6333 }))
    );
  }

  reverseGeocode(lat: number, lng: number): Observable<string> {
    return this.http.post<{ address: string }>(`${this.apiUrl}/reverse-geocode`, { lat, lng }).pipe(
      catchError(() => of({ address: 'São Paulo, SP, Brasil' }))
    ).pipe(
      catchError(() => of(''))
    );
  }

  getDirections(origin: string, destination: string, mode: 'driving' | 'walking' | 'transit' | 'bicycling' = 'driving'): Observable<DirectionsResult> {
    return this.http.post<DirectionsResult>(`${this.apiUrl}/directions`, { origin, destination, mode }).pipe(
      catchError(() => of(this.getMockDirections()))
    );
  }

  findNearby(location: { lat: number; lng: number }, type: string, radius = 1000): Observable<NearbyPlace[]> {
    return this.http.post<NearbyPlace[]>(`${this.apiUrl}/nearby`, { location, type, radius }).pipe(
      catchError(() => of(this.getMockNearbyPlaces()))
    );
  }

  addLocationToEvent(eventId: string, location: Location): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/event/${eventId}/location`, location).pipe(
      catchError(() => of(undefined))
    );
  }

  getMapUrl(location: Location, zoom = 15): string {
    if (location.coordinates) {
      return `https://www.google.com/maps/@${location.coordinates.lat},${location.coordinates.lng},${zoom}z`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
  }

  private getMockLocations(): Location[] {
    return [
      {
        id: 'loc-1',
        name: 'Avenida Paulista',
        address: 'Av. Paulista, São Paulo - SP, Brasil',
        coordinates: { lat: -23.5618, lng: -46.6565 }
      },
      {
        id: 'loc-2',
        name: 'Parque Ibirapuera',
        address: 'Av. Pedro Álvares Cabral, São Paulo - SP, Brasil',
        coordinates: { lat: -23.5872, lng: -46.6573 }
      },
      {
        id: 'loc-3',
        name: 'Shopping Center Norte',
        address: 'Av. Otto Baumgart, 500 - Vila Guilherme, São Paulo - SP, Brasil',
        coordinates: { lat: -23.5146, lng: -46.6177 }
      }
    ];
  }

  private getMockDirections(): DirectionsResult {
    return {
      routes: [
        {
          summary: 'Via Av. Paulista e Av. 23 de Maio',
          legs: [
            {
              startAddress: 'Av. Paulista, São Paulo - SP',
              endAddress: 'Parque Ibirapuera, São Paulo - SP',
              distance: 3500,
              duration: 15,
              steps: [
                {
                  instruction: 'Siga pela Av. Paulista em direção ao sul',
                  distance: 1200,
                  duration: 5
                },
                {
                  instruction: 'Vire à esquerda na Av. 23 de Maio',
                  distance: 1500,
                  duration: 7
                },
                {
                  instruction: 'Continue até o Parque Ibirapuera',
                  distance: 800,
                  duration: 3
                }
              ]
            }
          ],
          distance: 3500,
          duration: 15,
          trafficDelay: 5
        }
      ],
      distance: 3500,
      duration: 15
    };
  }

  private getMockNearbyPlaces(): NearbyPlace[] {
    return [
      {
        name: 'Café Girondino',
        address: 'Av. Paulista, 1948 - Bela Vista, São Paulo',
        rating: 4.5,
        type: 'cafe',
        distance: 250
      },
      {
        name: 'MASP - Museu de Arte',
        address: 'Av. Paulista, 1578 - Bela Vista, São Paulo',
        rating: 4.8,
        type: 'museum',
        distance: 400
      },
      {
        name: 'Restaurante Spot',
        address: 'Alameda Min. Rocha Azevedo, 72 - Cerqueira César, São Paulo',
        rating: 4.3,
        type: 'restaurant',
        distance: 600
      }
    ];
  }
}
