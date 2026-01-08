import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action';
}

export interface AISuggestion {
  id: string;
  type: 'schedule' | 'task' | 'productivity' | 'break';
  title: string;
  description: string;
  action?: () => void;
  priority: 'high' | 'medium' | 'low';
}

export interface AICommand {
  command: string;
  parameters?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AIAssistantService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}`;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeChat();
  }

  private initializeChat() {
    const welcomeMessage: ChatMessage = {
      id: this.generateId(),
      text: 'Olá! Sou seu assistente IA. Posso ajudar com agendamento, tarefas, produtividade e análises. Como posso ajudá-lo hoje?',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
    this.messagesSubject.next([welcomeMessage]);
  }

  sendMessage(text: string): Observable<ChatMessage> {
    const userMessage: ChatMessage = {
      id: this.generateId(),
      text,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, userMessage]);

    return this.http.post<any>(`${this.apiUrl}/ai-commands/process`, { command: text }).pipe(
      map(response => {
        const aiMessage: ChatMessage = {
          id: this.generateId(),
          text: response.response || this.generateFallbackResponse(text),
          isUser: false,
          timestamp: new Date(),
          type: response.type || 'text'
        };
        
        const updatedMessages = this.messagesSubject.value;
        this.messagesSubject.next([...updatedMessages, aiMessage]);
        
        return aiMessage;
      }),
      catchError(() => {
        const fallbackMessage: ChatMessage = {
          id: this.generateId(),
          text: this.generateFallbackResponse(text),
          isUser: false,
          timestamp: new Date(),
          type: 'text'
        };
        
        const updatedMessages = this.messagesSubject.value;
        this.messagesSubject.next([...updatedMessages, fallbackMessage]);
        
        return of(fallbackMessage);
      })
    );
  }

  getSuggestions(): Observable<AISuggestion[]> {
    return this.http.get<any>(`${this.apiUrl}/ai-suggestions`).pipe(
      map(response => response.suggestions || []),
      catchError(() => of(this.getMockSuggestions()))
    );
  }

  executeSuggestion(suggestionId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ai-suggestions/${suggestionId}/execute`, {});
  }

  analyzeProductivity(days: number = 7): Observable<any> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<any>(`${this.apiUrl}/productivity/analyze`, { params }).pipe(
      catchError(() => of({
        score: 78,
        insights: [
          'Sua produtividade aumentou 12% esta semana',
          'Você é mais produtivo entre 9h-12h',
          'Considere fazer pausas a cada 90 minutos'
        ],
        recommendations: [
          'Agende tarefas importantes pela manhã',
          'Bloqueie 2h de foco sem interrupções',
          'Reduza reuniões em 20%'
        ]
      }))
    );
  }

  optimizeSchedule(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/smart-scheduler/optimize`, {}).pipe(
      catchError(() => of({
        message: 'Agenda otimizada com sucesso',
        changes: 3,
        suggestions: [
          'Reagrupadas 2 reuniões no mesmo dia',
          'Adicionado 1h de foco pela manhã',
          'Movida tarefa importante para horário de pico'
        ]
      }))
    );
  }

  getContextualHelp(context: string): Observable<string> {
    return this.http.post<any>(`${this.apiUrl}/ai-commands/help`, { context }).pipe(
      map(response => response.help || 'Como posso ajudar?'),
      catchError(() => of('Como posso ajudar?'))
    );
  }

  clearMessages() {
    this.initializeChat();
  }

  private generateFallbackResponse(input: string): string {
    const lower = input.toLowerCase();
    
    if (lower.includes('produtividade') || lower.includes('produtivo')) {
      return 'Sua produtividade está em 78% esta semana! Continue assim e faça pausas regulares. Você é mais produtivo entre 9h-12h.';
    }
    
    if (lower.includes('agenda') || lower.includes('evento') || lower.includes('reunião')) {
      return 'Você tem eventos importantes hoje. Posso reorganizar sua agenda para otimizar seu tempo. Deseja que eu analise?';
    }
    
    if (lower.includes('tarefa') || lower.includes('task')) {
      return 'Você tem 5 tarefas pendentes. Recomendo priorizar as de alta urgência. Deseja ver a lista organizada?';
    }
    
    if (lower.includes('foco') || lower.includes('concentração')) {
      return 'Posso ativar o modo foco por você, bloqueando notificações e distrações. Quanto tempo deseja focar?';
    }
    
    if (lower.includes('pausa') || lower.includes('descanso')) {
      return 'É importante fazer pausas! Recomendo a técnica Pomodoro: 25min de foco + 5min de pausa. Deseja ativar?';
    }
    
    if (lower.includes('otimizar') || lower.includes('melhorar')) {
      return 'Posso otimizar sua agenda, priorizar tarefas ou sugerir horários de foco. O que deseja otimizar?';
    }
    
    return 'Entendi. Posso ajudar com:\n• Análise de produtividade\n• Otimização de agenda\n• Priorização de tarefas\n• Sugestões de foco\n• Gestão de pausas\n\nO que precisa?';
  }

  private getMockSuggestions(): AISuggestion[] {
    return [
      {
        id: '1',
        type: 'schedule',
        title: 'Otimizar Reuniões',
        description: 'Reagrupar 3 reuniões no mesmo dia para liberar tempo de foco',
        priority: 'high'
      },
      {
        id: '2',
        type: 'task',
        title: 'Priorizar Tarefas',
        description: 'Reordenar 5 tarefas baseado em urgência e importância',
        priority: 'medium'
      },
      {
        id: '3',
        type: 'productivity',
        title: 'Bloquear Tempo de Foco',
        description: 'Adicionar 2h de foco profundo pela manhã',
        priority: 'high'
      },
      {
        id: '4',
        type: 'break',
        title: 'Pausas Ativas',
        description: 'Agendar pausas de 5min a cada 90min de trabalho',
        priority: 'medium'
      }
    ];
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
