import { Injectable, inject } from '@angular/core.component';
import { HttpClient } from '@angular/common/http.component';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators.component';
import { environment } from '../../../environments/environment.component';
import { exportToJSON } from '../../utils/import-export-utils.component';
import { generateBackupFilename } from '../../utils/privacy-utils.component';


export interface BackupData {
  version: string;
  timestamp: Date;
  user: any;
  events: any[];
  tasks: any[];
  categories: any[];
  settings: any;
}

export interface BackupMetadata {
  id: string;
  filename: string;
  size: number;
  createdAt: Date;
  type: 'manual' | 'automatic';
}

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  private http = inject(HttpClient);

  private readonly BACKUP_VERSION = '1.0.0';

  createBackup(): Observable<BackupData> {
    return this.http.get<BackupData>(`${environment.apiUrl}/api/backup/create`).pipe(
      tap(data => {
        const filename = generateBackupFilename('smart-calendar');
        exportToJSON(data, filename);
      })
    );
  }

  createLocalBackup(data: BackupData): void {
    const backupData: BackupData = {
      ...data,
      version: this.BACKUP_VERSION,
      timestamp: new Date()
    };
    
    const filename = generateBackupFilename('smart-calendar');
    exportToJSON(backupData, filename);
  }

  restoreBackup(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('backup', file);
    
    return this.http.post<void>(`${environment.apiUrl}/api/backup/restore`, formData);
  }

  listBackups(): Observable<BackupMetadata[]> {
    return this.http.get<BackupMetadata[]>(`${environment.apiUrl}/api/backup/list`);
  }

  deleteBackup(backupId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/backup/${backupId}`);
  }

  scheduleAutomaticBackup(frequency: 'daily' | 'weekly' | 'monthly'): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/backup/schedule`, { frequency });
  }

  exportAllData(): Observable<BackupData> {
    return this.http.get<BackupData>(`${environment.apiUrl}/api/backup/export-all`).pipe(
      tap(data => {
        this.createLocalBackup(data);
      })
    );
  }

  validateBackup(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          const isValid = data.version && data.timestamp && data.events && data.tasks;
          resolve(!!isValid);
        } catch {
          resolve(false);
        }
      };
      
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  }
}
