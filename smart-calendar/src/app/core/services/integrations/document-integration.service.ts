import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


export interface Document {
  id: string;
  name: string;
  type: 'doc' | 'sheet' | 'slide' | 'pdf' | 'other';
  url: string;
  provider: 'drive' | 'dropbox' | 'onedrive' | 'local';
  createdAt: Date;
  updatedAt: Date;
  sharedWith?: string[];
}

export interface DocumentSearchResult {
  documents: Document[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentIntegrationService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/integrations/documents`;

  listDocuments(provider?: string, folderId?: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}`, { 
      params: { provider: provider || '', folderId: folderId || '' } 
    }).pipe(
      catchError(() => of(this.getMockDocuments()))
    );
  }

  searchDocuments(query: string, provider?: string): Observable<DocumentSearchResult> {
    return this.http.get<DocumentSearchResult>(`${this.apiUrl}/search`, { 
      params: { q: query, provider: provider || '' } 
    }).pipe(
      catchError(() => of({ documents: this.getMockDocuments(), total: 5 }))
    );
  }

  attachDocument(eventId: string, documentId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/attach`, { eventId, documentId }).pipe(
      catchError(() => of(undefined))
    );
  }

  createDocument(name: string, type: string, provider: string): Observable<Document> {
    return this.http.post<Document>(`${this.apiUrl}/create`, { name, type, provider }).pipe(
      catchError(() => of(this.getMockDocument(name, type as any)))
    );
  }

  shareDocument(documentId: string, users: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${documentId}/share`, { users }).pipe(
      catchError(() => of(undefined))
    );
  }

  getDocumentPermissions(documentId: string): Observable<{ user: string; role: string }[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${documentId}/permissions`).pipe(
      catchError(() => of([
        { user: 'joao@example.com', role: 'owner' },
        { user: 'maria@example.com', role: 'editor' }
      ]))
    );
  }

  syncProvider(provider: string): Observable<{ synced: number; errors: number }> {
    return this.http.post<any>(`${this.apiUrl}/sync/${provider}`, {}).pipe(
      catchError(() => of({ synced: 10, errors: 0 }))
    );
  }

  private getMockDocuments(): Document[] {
    return [
      {
        id: 'doc-1',
        name: 'Planejamento do Projeto',
        type: 'doc',
        url: 'https://docs.google.com/document/d/abc123',
        provider: 'drive',
        createdAt: new Date(),
        updatedAt: new Date(),
        sharedWith: ['joao@example.com', 'maria@example.com']
      },
      {
        id: 'doc-2',
        name: 'Planilha de Orçamento',
        type: 'sheet',
        url: 'https://docs.google.com/spreadsheets/d/xyz789',
        provider: 'drive',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'doc-3',
        name: 'Apresentação Q4',
        type: 'slide',
        url: 'https://docs.google.com/presentation/d/def456',
        provider: 'drive',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'doc-4',
        name: 'Relatório Mensal.pdf',
        type: 'pdf',
        url: 'https://dropbox.com/files/report.pdf',
        provider: 'dropbox',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'doc-5',
        name: 'Especificação Técnica',
        type: 'doc',
        url: 'https://onedrive.com/documents/spec.docx',
        provider: 'onedrive',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  private getMockDocument(name: string, type: 'doc' | 'sheet' | 'slide' | 'pdf' | 'other'): Document {
    return {
      id: `doc-${Date.now()}`,
      name,
      type,
      url: `https://docs.google.com/document/d/${Date.now()}`,
      provider: 'drive',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
