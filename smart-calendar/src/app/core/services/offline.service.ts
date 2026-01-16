import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface OfflineAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'event' | 'task' | 'category';
  data: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  isOnline$ = this.isOnlineSubject.asObservable();

  private pendingActionsSubject = new BehaviorSubject<OfflineAction[]>([]);
  pendingActions$ = this.pendingActionsSubject.asObservable();

  constructor() {
    this.initializeOnlineDetection();
    this.loadPendingActions();
  }

  private initializeOnlineDetection(): void {
    merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).subscribe(isOnline => {
      this.isOnlineSubject.next(isOnline);
      if (isOnline) this.syncPendingActions();
    });
  }

  private loadPendingActions(): void {
    const stored = localStorage.getItem('offlineActions');
    if (stored) {
      this.pendingActionsSubject.next(JSON.parse(stored));
    }
  }

  addPendingAction(action: Omit<OfflineAction, 'id' | 'timestamp'>): void {
    const newAction: OfflineAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    const current = this.pendingActionsSubject.value;
    const updated = [...current, newAction];
    this.pendingActionsSubject.next(updated);
    localStorage.setItem('offlineActions', JSON.stringify(updated));
  }

  private syncPendingActions(): void {
    const actions = this.pendingActionsSubject.value;
    if (actions.length === 0) return;

    // Sync logic would go here - calling backend endpoints
    console.log('Syncing pending actions:', actions);
    
    // Clear after sync
    this.pendingActionsSubject.next([]);
    localStorage.removeItem('offlineActions');
  }

  // Cache management
  cacheData(key: string, data: unknown): void {
    localStorage.setItem(`cache_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  }

  getCachedData<T>(key: string, maxAge = 3600000): T | null {
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > maxAge) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }

    return data as T;
  }

  clearCache(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith('cache_'))
      .forEach(key => localStorage.removeItem(key));
  }
}
