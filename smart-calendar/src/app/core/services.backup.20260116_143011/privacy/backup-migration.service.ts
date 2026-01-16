import { Injectable, inject } from '@angular/core.component';
import { HttpClient } from '@angular/common/http.component';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators.component';
import { environment } from '../../../../environments/environment.component';


export interface Backup {
  id: string;
  timestamp: Date;
  size: number;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'in_progress' | 'failed';
  location: 'local' | 'cloud';
}

export interface MigrationPlan {
  id: string;
  sourceProvider: string;
  targetProvider: string;
  itemsToMigrate: number;
  estimatedDuration: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface ExportFormat {
  format: 'json' | 'csv' | 'ical' | 'vcf';
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackupMigrationService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/privacy/backup`;

  createBackup(type: 'full' | 'incremental' = 'full', location: 'local' | 'cloud' = 'cloud'): Observable<Backup> {
    return this.http.post<Backup>(`${this.apiUrl}/create`, { type, location }).pipe(
      catchError(() => of(this.getMockBackup()))
    );
  }

  listBackups(): Observable<Backup[]> {
    return this.http.get<Backup[]>(`${this.apiUrl}/list`).pipe(
      catchError(() => of(this.getMockBackups()))
    );
  }

  restoreBackup(backupId: string): Observable<{ success: boolean; itemsRestored: number }> {
    return this.http.post<{ success: boolean; itemsRestored: number }>(`${this.apiUrl}/restore/${backupId}`, {}).pipe(
      catchError(() => of({ success: false, itemsRestored: 0 }))
    );
  }

  deleteBackup(backupId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${backupId}`).pipe(
      catchError(() => of(undefined))
    );
  }

  exportData(format: 'json' | 'csv' | 'ical' | 'vcf', dataTypes: string[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export`, { format, dataTypes }, { responseType: 'blob' }).pipe(
      catchError(() => of(new Blob()))
    );
  }

  getAvailableExportFormats(): Observable<ExportFormat[]> {
    return of([
      { format: 'json', name: 'JSON', description: 'Formato universal de dados' },
      { format: 'csv', name: 'CSV', description: 'Planilha compatível com Excel' },
      { format: 'ical', name: 'iCal', description: 'Calendário padrão (Google, Outlook, Apple)' },
      { format: 'vcf', name: 'vCard', description: 'Contatos padrão' }
    ]);
  }

  importData(file: File, format: string): Observable<{ imported: number; errors: number }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);
    
    return this.http.post<{ imported: number; errors: number }>(`${this.apiUrl}/import`, formData).pipe(
      catchError(() => of({ imported: 0, errors: 0 }))
    );
  }

  createMigrationPlan(sourceProvider: string, targetProvider: string, dataTypes: string[]): Observable<MigrationPlan> {
    return this.http.post<MigrationPlan>(`${this.apiUrl}/migrate/plan`, { sourceProvider, targetProvider, dataTypes }).pipe(
      catchError(() => of(this.getMockMigrationPlan()))
    );
  }

  executeMigration(planId: string): Observable<{ status: string; progress: number }> {
    return this.http.post<{ status: string; progress: number }>(`${this.apiUrl}/migrate/execute/${planId}`, {}).pipe(
      catchError(() => of({ status: 'failed', progress: 0 }))
    );
  }

  getMigrationStatus(planId: string): Observable<MigrationPlan> {
    return this.http.get<MigrationPlan>(`${this.apiUrl}/migrate/status/${planId}`).pipe(
      catchError(() => of(this.getMockMigrationPlan()))
    );
  }

  scheduleAutoBackup(frequency: 'daily' | 'weekly' | 'monthly', time: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/schedule`, { frequency, time }).pipe(
      catchError(() => of(undefined))
    );
  }

  private getMockBackup(): Backup {
    return {
      id: `backup-${Date.now()}`,
      timestamp: new Date(),
      size: 15728640,
      type: 'full',
      status: 'completed',
      location: 'cloud'
    };
  }

  private getMockBackups(): Backup[] {
    return [
      {
        id: 'backup-1',
        timestamp: new Date(),
        size: 15728640,
        type: 'full',
        status: 'completed',
        location: 'cloud'
      },
      {
        id: 'backup-2',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        size: 2097152,
        type: 'incremental',
        status: 'completed',
        location: 'cloud'
      },
      {
        id: 'backup-3',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        size: 14680064,
        type: 'full',
        status: 'completed',
        location: 'local'
      }
    ];
  }

  private getMockMigrationPlan(): MigrationPlan {
    return {
      id: `migration-${Date.now()}`,
      sourceProvider: 'Google Calendar',
      targetProvider: 'Smart Calendar',
      itemsToMigrate: 250,
      estimatedDuration: 300,
      status: 'pending'
    };
  }
}
