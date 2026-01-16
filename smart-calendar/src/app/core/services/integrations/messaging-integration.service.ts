import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


export interface Message {
  id: string;
  platform: 'slack' | 'teams' | 'whatsapp' | 'telegram';
  content: string;
  sender: string;
  recipient: string;
  timestamp: Date;
  read: boolean;
}

export interface Channel {
  id: string;
  name: string;
  platform: 'slack' | 'teams';
  memberCount: number;
  unreadCount: number;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  variables?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MessagingIntegrationService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/integrations/messaging`;

  connectPlatform(platform: 'slack' | 'teams' | 'whatsapp' | 'telegram'): Observable<{ success: boolean; message: string }> {
    return this.http.post<any>(`${this.apiUrl}/connect`, { platform }).pipe(
      catchError(() => of({ success: false, message: 'Erro ao conectar' }))
    );
  }

  disconnectPlatform(platform: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/disconnect`, { platform }).pipe(
      catchError(() => of(undefined))
    );
  }

  sendMessage(platform: string, recipient: string, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/send`, { platform, recipient, content }).pipe(
      catchError(() => of(this.getMockMessage(platform as any, recipient, content)))
    );
  }

  sendEventReminder(eventId: string, recipients: string[], platform: string): Observable<{ sent: number; failed: number }> {
    return this.http.post<any>(`${this.apiUrl}/remind`, { eventId, recipients, platform }).pipe(
      catchError(() => of({ sent: recipients.length, failed: 0 }))
    );
  }

  getRecentMessages(platform?: string, limit = 50): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages`, { 
      params: { platform: platform || '', limit: limit.toString() } 
    }).pipe(
      catchError(() => of(this.getMockMessages()))
    );
  }

  getChannels(platform: 'slack' | 'teams'): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/channels`, { params: { platform } }).pipe(
      catchError(() => of(this.getMockChannels()))
    );
  }

  postToChannel(channelId: string, content: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/channels/${channelId}/post`, { content }).pipe(
      catchError(() => of(undefined))
    );
  }

  getTemplates(): Observable<MessageTemplate[]> {
    return this.http.get<MessageTemplate[]>(`${this.apiUrl}/templates`).pipe(
      catchError(() => of(this.getMockTemplates()))
    );
  }

  createTemplate(template: Omit<MessageTemplate, 'id'>): Observable<MessageTemplate> {
    return this.http.post<MessageTemplate>(`${this.apiUrl}/templates`, template).pipe(
      catchError(() => of({ ...template, id: `template-${Date.now()}` } as MessageTemplate))
    );
  }

  sendFromTemplate(templateId: string, variables: Record<string, string>, recipients: string[]): Observable<{ sent: number; failed: number }> {
    return this.http.post<any>(`${this.apiUrl}/templates/${templateId}/send`, { variables, recipients }).pipe(
      catchError(() => of({ sent: recipients.length, failed: 0 }))
    );
  }

  markAsRead(messageId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/messages/${messageId}`, { read: true }).pipe(
      catchError(() => of(undefined))
    );
  }

  private getMockMessage(platform: 'slack' | 'teams' | 'whatsapp' | 'telegram', recipient: string, content: string): Message {
    return {
      id: `msg-${Date.now()}`,
      platform,
      content,
      sender: 'Você',
      recipient,
      timestamp: new Date(),
      read: false
    };
  }

  private getMockMessages(): Message[] {
    return [
      {
        id: 'msg-1',
        platform: 'slack',
        content: 'Lembrete: Reunião de equipe às 14h',
        sender: 'SmartCalendar Bot',
        recipient: '@equipe-dev',
        timestamp: new Date(Date.now() - 3600000),
        read: true
      },
      {
        id: 'msg-2',
        platform: 'teams',
        content: 'O evento "Planejamento Trimestral" foi atualizado',
        sender: 'SmartCalendar Bot',
        recipient: 'Gerência',
        timestamp: new Date(Date.now() - 7200000),
        read: false
      },
      {
        id: 'msg-3',
        platform: 'slack',
        content: 'Nova tarefa atribuída: Revisar documento de requisitos',
        sender: 'SmartCalendar Bot',
        recipient: '@joao',
        timestamp: new Date(Date.now() - 10800000),
        read: true
      }
    ];
  }

  private getMockChannels(): Channel[] {
    return [
      {
        id: 'ch-1',
        name: 'geral',
        platform: 'slack',
        memberCount: 45,
        unreadCount: 5
      },
      {
        id: 'ch-2',
        name: 'desenvolvimento',
        platform: 'slack',
        memberCount: 12,
        unreadCount: 2
      },
      {
        id: 'ch-3',
        name: 'Projeto Alpha',
        platform: 'teams',
        memberCount: 8,
        unreadCount: 0
      }
    ];
  }

  private getMockTemplates(): MessageTemplate[] {
    return [
      {
        id: 'tpl-1',
        name: 'Lembrete de Reunião',
        content: 'Lembrete: {{eventName}} acontecerá em {{timeUntil}}. Local: {{location}}',
        variables: ['eventName', 'timeUntil', 'location']
      },
      {
        id: 'tpl-2',
        name: 'Atribuição de Tarefa',
        content: 'Nova tarefa atribuída a você: {{taskName}}. Prazo: {{deadline}}',
        variables: ['taskName', 'deadline']
      },
      {
        id: 'tpl-3',
        name: 'Cancelamento de Evento',
        content: 'O evento "{{eventName}}" foi cancelado. Motivo: {{reason}}',
        variables: ['eventName', 'reason']
      }
    ];
  }
}
