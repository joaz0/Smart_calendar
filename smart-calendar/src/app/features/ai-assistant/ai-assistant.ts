import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ai-assistant">
      <div class="ai-header">
        <h1><i class="fas fa-robot"></i> Assistente IA</h1>
        <p>Seu assistente inteligente para produtividade</p>
      </div>
      
      <div class="chat-container">
        <div class="chat-messages">
          <div class="message ai">
            <i class="fas fa-robot"></i>
            <div class="message-content">
              Olá! Como posso ajudá-lo hoje? Posso sugerir horários, organizar tarefas ou analisar sua produtividade.
            </div>
          </div>
          
          <div class="message user">
            <div class="message-content">
              Como está minha produtividade esta semana?
            </div>
            <i class="fas fa-user"></i>
          </div>
          
          <div class="message ai">
            <i class="fas fa-robot"></i>
            <div class="message-content">
              Sua produtividade está 15% acima da média! Você completou 85% das tarefas planejadas. Continue assim!
            </div>
          </div>
        </div>
        
        <div class="chat-input">
          <input type="text" placeholder="Digite sua mensagem...">
          <button><i class="fas fa-paper-plane"></i></button>
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
      }
    }
  `]
})
export class AiAssistantComponent {}