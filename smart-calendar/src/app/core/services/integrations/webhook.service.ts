import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


export interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
  active: boolean;
  secret?: string;
  createdAt: Date;
}

export interface WebhookTestResponse {
  success: boolean;
  response?: Record<string, unknown>;
}

export interface WebhookLog {
  id: string;
  timestamp: Date;
  event: WebhookEvent;
  status: number;
  response?: string;
}

export type WebhookEvent = 
  | 'event.created'
  | 'event.updated'
  | 'event.deleted'
  | 'task.created'
  | 'task.completed'
  | 'reminder.triggered';

@Injectable({
  providedIn: 'root'
})
export class WebhookService {
  private http = inject(HttpClient);


  createWebhook(url: string, events: WebhookEvent[]): Observable<Webhook> {
    return this.http.post<Webhook>(`${environment.apiUrl}/webhooks`, { url, events });
  }

  listWebhooks(): Observable<Webhook[]> {
    return this.http.get<Webhook[]>(`${environment.apiUrl}/webhooks`);
  }

  updateWebhook(id: string, data: Partial<Webhook>): Observable<Webhook> {
    return this.http.patch<Webhook>(`${environment.apiUrl}/webhooks/${id}`, data);
  }

  deleteWebhook(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/webhooks/${id}`);
  }

  testWebhook(id: string): Observable<WebhookTestResponse> {
    return this.http.post<WebhookTestResponse>(`${environment.apiUrl}/webhooks/${id}/test`, {});
  }

  toggleWebhook(id: string, active: boolean): Observable<Webhook> {
    return this.http.patch<Webhook>(`${environment.apiUrl}/webhooks/${id}`, { active });
  }

  getWebhookLogs(id: string, limit = 50): Observable<WebhookLog[]> {
    return this.http.get<WebhookLog[]>(`${environment.apiUrl}/webhooks/${id}/logs`, {
      params: { limit: limit.toString() }
    });
  }
}
