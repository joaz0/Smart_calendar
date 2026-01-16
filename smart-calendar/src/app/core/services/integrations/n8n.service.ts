import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface N8nWebhook {
  url: string;
  data: any;
}

export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class N8nService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/n8n`;

  triggerWebhook(webhook: N8nWebhook): Observable<any> {
    return this.http.post(`${this.apiUrl}/webhook`, webhook);
  }

  executeWorkflow(workflowId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/workflow/${workflowId}/execute`, data);
  }

  getWorkflows(): Observable<N8nWorkflow[]> {
    return this.http.get<N8nWorkflow[]>(`${this.apiUrl}/workflows`);
  }
}
