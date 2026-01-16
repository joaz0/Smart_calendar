import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { Subject, takeUntil } from 'rxjs';
import { AIAssistantService, ChatMessage, AISuggestion } from '../../core/services/ai/ai-assistant.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatBadgeModule
],
  templateUrl: './ai-assistant.html',
  styleUrls: ['./ai-assistant.scss']
})
export class AiAssistantComponent implements OnInit, OnDestroy, AfterViewChecked {
  private aiService = inject(AIAssistantService);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  private destroy$ = new Subject<void>();
  private shouldScrollToBottom = false;

  currentMessage = '';
  messages: ChatMessage[] = [];
  suggestions: AISuggestion[] = [];
  loading = false;
  loadingSuggestions = false;
  
  quickActions = [
    { id: 'schedule', label: 'Otimizar Agenda', icon: 'calendar_today' },
    { id: 'productivity', label: 'Produtividade', icon: 'trending_up' },
    { id: 'tasks', label: 'Priorizar Tarefas', icon: 'task_alt' },
    { id: 'focus', label: 'Ativar Foco', icon: 'center_focus_strong' }
  ];

  ngOnInit() {
    this.aiService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        this.messages = messages;
        this.shouldScrollToBottom = true;
      });

    this.loadSuggestions();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendMessage() {
    if (!this.currentMessage.trim() || this.loading) return;

    const messageText = this.currentMessage;
    this.currentMessage = '';
    this.loading = true;

    this.aiService.sendMessage(messageText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.loadSuggestions();
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  loadSuggestions() {
    this.loadingSuggestions = true;
    this.aiService.getSuggestions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (suggestions) => {
          this.suggestions = suggestions;
          this.loadingSuggestions = false;
        },
        error: () => {
          this.loadingSuggestions = false;
        }
      });
  }

  quickAction(_actionId: string) {
    const actions: Record<string, string> = {
      schedule: 'Analise minha agenda e sugira otimizações',
      productivity: 'Como está minha produtividade esta semana?',
      tasks: 'Quais tarefas devo priorizar hoje?',
      focus: 'Ativar modo foco por 2 horas'
    };

    this.currentMessage = actions[actionId] || '';
    this.sendMessage();
  }

  executeSuggestion(suggestion: AISuggestion) {
    this.loading = true;
    this.aiService.executeSuggestion(suggestion.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.currentMessage = `Executar: ${suggestion.title}`;
          this.sendMessage();
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  analyzeProductivity() {
    this.currentMessage = 'Analise minha produtividade dos últimos 7 dias';
    this.sendMessage();
  }

  optimizeSchedule() {
    this.currentMessage = 'Otimize minha agenda da próxima semana';
    this.sendMessage();
  }

  clearChat() {
    if (confirm('Limpar todo o histórico de conversa?')) {
      this.aiService.clearMessages();
    }
  }

  getSuggestionIcon(type: string): string {
    const icons: Record<string, string> = {
      schedule: 'calendar_today',
      task: 'task_alt',
      productivity: 'trending_up',
      break: 'coffee'
    };
    return icons[type] || 'lightbulb';
  }

  getSuggestionColor(priority: string): string {
    const colors: Record<string, string> = {
      high: '#F44336',
      medium: '#FF9800',
      low: '#4CAF50'
    };
    return colors[priority] || '#9E9E9E';
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}
