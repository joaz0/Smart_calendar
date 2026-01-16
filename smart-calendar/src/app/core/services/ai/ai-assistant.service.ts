import { Injectable, inject } from '@angular/core.component';
import { HttpClient } from '@angular/common/http.component';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators.component';
import { environment } from '../../../../environments/environment.component';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  type: 'schedule' | 'task' | 'productivity' | 'break';
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AIAssistantService {
  private http = inject(HttpClient);

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  sendMessage(message: string): Observable<ChatMessage> {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    this.messagesSubject.next([...this.messagesSubject.value, userMessage]);

    return this.http.post<{ response: string }>(`${environment.apiUrl}/ai/chat`, { message }).pipe(
      map(res => ({
        id: (Date.now() + 1).toString(),
        text: res.response,
        isUser: false,
        timestamp: new Date()
      })),
      tap(aiMessage => this.messagesSubject.next([...this.messagesSubject.value, aiMessage]))
    );
  }

  getSuggestions(): Observable<AISuggestion[]> {
    return this.http.get<AISuggestion[]>(`${environment.apiUrl}/ai/suggestions`);
  }

  executeSuggestion(suggestionId: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/ai/suggestions/${suggestionId}/execute`, {});
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
  }
}
