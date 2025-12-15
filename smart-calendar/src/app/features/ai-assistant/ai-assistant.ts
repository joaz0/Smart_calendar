import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="ai-assistant">
      <div class="ai-header">
        <h1><i class="fas fa-robot"></i> Assistente IA</h1>
        <p>Seu assistente inteligente para produtividade</p>
      </div>
      
      <div class="chat-container">
        <div class="chat-messages">
          <div *ngFor="let message of messages" 
               class="message" 
               [class.ai]="!message.isUser"
               [class.user]="message.isUser">
            <i *ngIf="!message.isUser" class="fas fa-robot"></i>
            <div class="message-content">
              {{ message.text }}
            </div>
            <i *ngIf="message.isUser" class="fas fa-user"></i>
          </div>
        </div>
        
        <div class="quick-actions">
          <button (click)="quickSuggestion('schedule')" class="quick-btn">
            <i class="fas fa-calendar"></i> Otimizar Agenda
          </button>
          <button (click)="quickSuggestion('productivity')" class="quick-btn">
            <i class="fas fa-chart-line"></i> Produtividade
          </button>
          <button (click)="quickSuggestion('tasks')" class="quick-btn">
            <i class="fas fa-tasks"></i> Priorizar Tarefas
          </button>
        </div>
        
        <div class="chat-input">
          <input type="text" 
                 [(ngModel)]="currentMessage"
                 (keydown.enter)="sendMessage()"
                 placeholder="Digite sua mensagem...">
          <button (click)="sendMessage()" [disabled]="!currentMessage.trim()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ai-assistant {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      height: calc(100vh - 200px);
      display: flex;
      flex-direction: column;
    }
    
    .ai-header {
      margin-bottom: 2rem;
      
      h1 {
        color: #6d3bf7;
        margin: 0 0 0.5rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      p {
        color: #666;
        margin: 0;
      }
    }
    
    .chat-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .chat-messages {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
    }
    
    .message {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 1rem;
      
      &.ai {
        i { color: #6d3bf7; }
      }
      
      &.user {
        flex-direction: row-reverse;
        i { color: #666; }
      }
    }
    
    .message-content {
      background: #f5f5f5;
      padding: 0.75rem;
      border-radius: 12px;
      max-width: 70%;
    }
    
    .user .message-content {
      background: #6d3bf7;
      color: white;
    }
    
    .quick-actions {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
      border-top: 1px solid #eee;
      flex-wrap: wrap;
      
      .quick-btn {
        background: #f0f0f0;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.85rem;
        transition: all 0.2s;
        
        &:hover {
          background: #6d3bf7;
          color: white;
        }
        
        i {
          margin-right: 0.25rem;
        }
      }
    }
    
    .chat-input {
      display: flex;
      padding: 1rem;
      border-top: 1px solid #eee;
      
      input {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 25px;
        outline: none;
      }
      
      button {
        background: #6d3bf7;
        color: white;
        border: none;
        padding: 0.75rem 1rem;
        border-radius: 50%;
        margin-left: 0.5rem;
        cursor: pointer;
        
        &:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      }
    }
  `]
})
export class AiAssistantComponent implements OnInit {
  currentMessage = '';
  messages: any[] = [];
  
  ngOnInit() {
    this.messages = [
      {
        text: 'Olá! Como posso ajudá-lo hoje? Posso sugerir horários, organizar tarefas ou analisar sua produtividade.',
        isUser: false,
        timestamp: new Date()
      }
    ];
  }
  
  sendMessage() {
    if (!this.currentMessage.trim()) return;
    
    this.messages.push({
      text: this.currentMessage,
      isUser: true,
      timestamp: new Date()
    });
    
    setTimeout(() => {
      const response = this.generateResponse(this.currentMessage);
      this.messages.push({
        text: response,
        isUser: false,
        timestamp: new Date()
      });
    }, 1000);
    
    this.currentMessage = '';
  }
  
  generateResponse(message: string): string {
    const lower = message.toLowerCase();
    
    if (lower.includes('produtividade')) {
      return 'Sua produtividade está 85% esta semana! Continue assim e faça pausas regulares.';
    } else if (lower.includes('agenda')) {
      return 'Você tem 3 eventos hoje: reunião às 9h, apresentação às 14h e call às 16h.';
    } else if (lower.includes('tarefa')) {
      return 'Você tem 5 tarefas pendentes. Recomendo começar pela de alta prioridade.';
    } else {
      return 'Posso ajudar com agenda, tarefas, produtividade e análises. O que precisa?';
    }
  }
  
  quickSuggestion(type: string) {
    let suggestion = '';
    
    switch (type) {
      case 'schedule':
        suggestion = 'Analisar agenda para otimização';
        break;
      case 'productivity':
        suggestion = 'Como está minha produtividade?';
        break;
      case 'tasks':
        suggestion = 'Quais tarefas devo priorizar?';
        break;
    }
    
    this.currentMessage = suggestion;
    this.sendMessage();
  }
}