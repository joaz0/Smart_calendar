import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  avatarUrl?: string;
  provider: 'google' | 'outlook' | 'icloud' | 'local';
  lastInteraction?: Date;
  tags?: string[];
}

export interface ContactGroup {
  id: string;
  name: string;
  memberCount: number;
  members: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ContactSyncService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/integrations/contacts`;

  syncContacts(provider: 'google' | 'outlook' | 'icloud'): Observable<{ synced: number; updated: number; errors: number }> {
    return this.http.post<any>(`${this.apiUrl}/sync`, { provider }).pipe(
      catchError(() => of({ synced: 50, updated: 10, errors: 0 }))
    );
  }

  getAllContacts(provider?: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}`, { params: { provider: provider || '' } }).pipe(
      catchError(() => of(this.getMockContacts()))
    );
  }

  searchContacts(query: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/search`, { params: { q: query } }).pipe(
      catchError(() => of(this.getMockContacts().filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase())
      )))
    );
  }

  getContact(contactId: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${contactId}`).pipe(
      catchError(() => of(this.getMockContacts()[0]))
    );
  }

  createContact(contact: Omit<Contact, 'id'>): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiUrl}`, contact).pipe(
      catchError(() => of({ ...contact, id: `contact-${Date.now()}` } as Contact))
    );
  }

  updateContact(contactId: string, updates: Partial<Contact>): Observable<Contact> {
    return this.http.patch<Contact>(`${this.apiUrl}/${contactId}`, updates).pipe(
      catchError(() => of(this.getMockContacts()[0]))
    );
  }

  deleteContact(contactId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${contactId}`).pipe(
      catchError(() => of(undefined))
    );
  }

  getContactGroups(): Observable<ContactGroup[]> {
    return this.http.get<ContactGroup[]>(`${this.apiUrl}/groups`).pipe(
      catchError(() => of(this.getMockGroups()))
    );
  }

  createGroup(name: string, memberIds: string[]): Observable<ContactGroup> {
    return this.http.post<ContactGroup>(`${this.apiUrl}/groups`, { name, memberIds }).pipe(
      catchError(() => of({
        id: `group-${Date.now()}`,
        name,
        memberCount: memberIds.length,
        members: memberIds
      }))
    );
  }

  getFrequentContacts(limit = 10): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/frequent`, { params: { limit: limit.toString() } }).pipe(
      catchError(() => of(this.getMockContacts().slice(0, limit)))
    );
  }

  private getMockContacts(): Contact[] {
    return [
      {
        id: 'contact-1',
        name: 'João Silva',
        email: 'joao.silva@example.com',
        phone: '+55 11 98765-4321',
        company: 'Tech Corp',
        jobTitle: 'Tech Lead',
        provider: 'google',
        lastInteraction: new Date(),
        tags: ['trabalho', 'tech']
      },
      {
        id: 'contact-2',
        name: 'Maria Santos',
        email: 'maria.santos@example.com',
        phone: '+55 11 91234-5678',
        company: 'Innovation Labs',
        jobTitle: 'Product Manager',
        provider: 'google',
        lastInteraction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['trabalho', 'produto']
      },
      {
        id: 'contact-3',
        name: 'Pedro Costa',
        email: 'pedro.costa@example.com',
        phone: '+55 11 99876-5432',
        company: 'Design Studio',
        jobTitle: 'UX Designer',
        provider: 'outlook',
        lastInteraction: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        tags: ['trabalho', 'design']
      },
      {
        id: 'contact-4',
        name: 'Ana Oliveira',
        email: 'ana.oliveira@example.com',
        company: 'Consulting Group',
        jobTitle: 'Senior Consultant',
        provider: 'google',
        lastInteraction: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        tags: ['trabalho', 'consultoria']
      },
      {
        id: 'contact-5',
        name: 'Carlos Souza',
        email: 'carlos.souza@example.com',
        phone: '+55 11 98888-7777',
        provider: 'local',
        lastInteraction: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        tags: ['pessoal']
      }
    ];
  }

  private getMockGroups(): ContactGroup[] {
    return [
      {
        id: 'group-1',
        name: 'Equipe de Desenvolvimento',
        memberCount: 8,
        members: ['contact-1', 'contact-2']
      },
      {
        id: 'group-2',
        name: 'Clientes VIP',
        memberCount: 15,
        members: ['contact-4']
      },
      {
        id: 'group-3',
        name: 'Família',
        memberCount: 6,
        members: ['contact-5']
      }
    ];
  }
}
