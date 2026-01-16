import { Injectable, inject } from '@angular/core.component';
import { HttpClient } from '@angular/common/http.component';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators.component';
import { environment } from '../../../../environments/environment.component';


export interface InheritancePlan {
  id: string;
  userId: string;
  trustees: Trustee[];
  inactivityPeriod: number;
  notificationSchedule: number[];
  assets: DigitalAsset[];
  instructions: string;
  status: 'active' | 'inactive' | 'triggered';
  lastActivityCheck?: Date;
}

export interface Trustee {
  id: string;
  name: string;
  email: string;
  relationship: string;
  accessLevel: 'full' | 'limited' | 'view_only';
  verified: boolean;
}

export interface DigitalAsset {
  id: string;
  type: 'calendar' | 'document' | 'note' | 'contact';
  name: string;
  includeInInheritance: boolean;
  specificInstructions?: string;
}

export interface ActivityCheck {
  id: string;
  timestamp: Date;
  type: 'login' | 'event_created' | 'manual_check';
  verified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DigitalInheritanceService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/privacy/inheritance`;

  getInheritancePlan(): Observable<InheritancePlan> {
    return this.http.get<InheritancePlan>(`${this.apiUrl}/plan`).pipe(
      catchError(() => of(this.getMockPlan()))
    );
  }

  createInheritancePlan(plan: Omit<InheritancePlan, 'id' | 'userId' | 'status'>): Observable<InheritancePlan> {
    return this.http.post<InheritancePlan>(`${this.apiUrl}/plan`, plan).pipe(
      catchError(() => of({ ...plan, id: `plan-${Date.now()}`, userId: 'currentUser', status: 'active' } as InheritancePlan))
    );
  }

  updateInheritancePlan(updates: Partial<InheritancePlan>): Observable<InheritancePlan> {
    return this.http.patch<InheritancePlan>(`${this.apiUrl}/plan`, updates).pipe(
      catchError(() => of(this.getMockPlan()))
    );
  }

  addTrustee(trustee: Omit<Trustee, 'id' | 'verified'>): Observable<Trustee> {
    return this.http.post<Trustee>(`${this.apiUrl}/trustees`, trustee).pipe(
      catchError(() => of({ ...trustee, id: `trustee-${Date.now()}`, verified: false } as Trustee))
    );
  }

  removeTrustee(trusteeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/trustees/${trusteeId}`).pipe(
      catchError(() => of(undefined))
    );
  }

  updateTrustee(trusteeId: string, updates: Partial<Trustee>): Observable<Trustee> {
    return this.http.patch<Trustee>(`${this.apiUrl}/trustees/${trusteeId}`, updates).pipe(
      catchError(() => of(this.getMockPlan().trustees[0]))
    );
  }

  sendVerificationToTrustee(trusteeId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/trustees/${trusteeId}/verify`, {}).pipe(
      catchError(() => of(undefined))
    );
  }

  configureAssets(assets: DigitalAsset[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/assets`, { assets }).pipe(
      catchError(() => of(undefined))
    );
  }

  getAssets(): Observable<DigitalAsset[]> {
    return this.http.get<DigitalAsset[]>(`${this.apiUrl}/assets`).pipe(
      catchError(() => of(this.getMockAssets()))
    );
  }

  recordActivity(type: 'login' | 'event_created' | 'manual_check'): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/activity`, { type, timestamp: new Date() }).pipe(
      catchError(() => of(undefined))
    );
  }

  getActivityHistory(limit = 10): Observable<ActivityCheck[]> {
    return this.http.get<ActivityCheck[]>(`${this.apiUrl}/activity`, { params: { limit: limit.toString() } }).pipe(
      catchError(() => of(this.getMockActivityHistory()))
    );
  }

  performManualCheck(): Observable<{ success: boolean; nextCheck: Date }> {
    return this.http.post<any>(`${this.apiUrl}/manual-check`, {}).pipe(
      catchError(() => of({
        success: true,
        nextCheck: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }))
    );
  }

  testNotification(): Observable<{ sent: boolean; recipients: string[] }> {
    return this.http.post<any>(`${this.apiUrl}/test-notification`, {}).pipe(
      catchError(() => of({ sent: false, recipients: [] }))
    );
  }

  cancelInheritanceTrigger(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/cancel-trigger`, {}).pipe(
      catchError(() => of(undefined))
    );
  }

  private getMockPlan(): InheritancePlan {
    return {
      id: 'plan-1',
      userId: 'currentUser',
      trustees: [
        {
          id: 'trustee-1',
          name: 'João Silva',
          email: 'joao@example.com',
          relationship: 'Cônjuge',
          accessLevel: 'full',
          verified: true
        },
        {
          id: 'trustee-2',
          name: 'Maria Santos',
          email: 'maria@example.com',
          relationship: 'Irmã',
          accessLevel: 'limited',
          verified: true
        }
      ],
      inactivityPeriod: 180,
      notificationSchedule: [90, 60, 30, 7, 1],
      assets: this.getMockAssets(),
      instructions: 'Em caso de inatividade prolongada, conceder acesso aos trustees listados conforme níveis especificados.',
      status: 'active',
      lastActivityCheck: new Date()
    };
  }

  private getMockAssets(): DigitalAsset[] {
    return [
      {
        id: 'asset-1',
        type: 'calendar',
        name: 'Calendário Pessoal',
        includeInInheritance: true,
        specificInstructions: 'Compartilhar eventos familiares e compromissos pessoais'
      },
      {
        id: 'asset-2',
        type: 'document',
        name: 'Documentos Importantes',
        includeInInheritance: true,
        specificInstructions: 'Acesso completo a todos os documentos'
      },
      {
        id: 'asset-3',
        type: 'contact',
        name: 'Lista de Contatos',
        includeInInheritance: true
      },
      {
        id: 'asset-4',
        type: 'note',
        name: 'Notas Profissionais',
        includeInInheritance: false,
        specificInstructions: 'Excluir automaticamente'
      }
    ];
  }

  private getMockActivityHistory(): ActivityCheck[] {
    return [
      {
        id: 'check-1',
        timestamp: new Date(),
        type: 'login',
        verified: true
      },
      {
        id: 'check-2',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: 'event_created',
        verified: true
      },
      {
        id: 'check-3',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        type: 'manual_check',
        verified: true
      }
    ];
  }
}
