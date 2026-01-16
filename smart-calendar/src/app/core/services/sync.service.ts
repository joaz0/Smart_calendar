import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface SyncStatus {
  lastSync: Date | null;
  syncing: boolean;
  error: string | null;
  pendingChanges: number;
}

export interface SyncData {
  events: any[];
  tasks: any[];
  categories: any[];
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private http = inject(HttpClient);

  private syncStatusSubject = new BehaviorSubject<SyncStatus>({
    lastSync: null,
    syncing: false,
    error: null,
    pendingChanges: 0
  });
  
  syncStatus$ = this.syncStatusSubject.asObservable();
  private autoSyncInterval = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.initializeAutoSync();
  }

  private initializeAutoSync(): void {
    interval(this.autoSyncInterval)
      .pipe(switchMap(() => this.syncAll()))
      .subscribe();
  }

  syncAll(): Observable<SyncData> {
    this.updateSyncStatus({ syncing: true, error: null });
    
    return this.http.get<SyncData>(`${environment.apiUrl}/api/sync`).pipe(
      tap(data => {
        this.updateSyncStatus({
          lastSync: new Date(),
          syncing: false,
          error: null,
          pendingChanges: 0
        });
        this.saveSyncData(data);
      }),
      catchError(error => {
        this.updateSyncStatus({
          syncing: false,
          error: error.message || 'Sync failed'
        });
        throw error;
      })
    );
  }

  pushChanges(changes: Partial<SyncData>): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/sync/push`, changes).pipe(
      tap(() => {
        this.updateSyncStatus({ pendingChanges: 0 });
      })
    );
  }

  private saveSyncData(data: SyncData): void {
    localStorage.setItem('syncData', JSON.stringify(data));
    localStorage.setItem('lastSync', new Date().toISOString());
  }

  getLocalSyncData(): SyncData | null {
    const data = localStorage.getItem('syncData');
    return data ? JSON.parse(data) : null;
  }

  private updateSyncStatus(update: Partial<SyncStatus>): void {
    const current = this.syncStatusSubject.value;
    this.syncStatusSubject.next({ ...current, ...update });
  }

  markPendingChange(): void {
    const current = this.syncStatusSubject.value;
    this.updateSyncStatus({ pendingChanges: current.pendingChanges + 1 });
  }
}
