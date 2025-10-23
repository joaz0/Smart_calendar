import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tasks">
      <div class="tasks-header">
        <h1><i class="fas fa-check-circle"></i> Tarefas</h1>
        <button class="add-btn"><i class="fas fa-plus"></i> Nova Tarefa</button>
      </div>
      
      <div class="tasks-content">
        <div class="task-item">
          <i class="fas fa-circle task-status"></i>
          <span class="task-text">Revisar relatório mensal</span>
          <span class="task-priority high">Alta</span>
        </div>
        
        <div class="task-item">
          <i class="fas fa-circle task-status"></i>
          <span class="task-text">Preparar apresentação</span>
          <span class="task-priority medium">Média</span>
        </div>
        
        <div class="task-item completed">
          <i class="fas fa-check-circle task-status"></i>
          <span class="task-text">Enviar emails</span>
          <span class="task-priority low">Baixa</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tasks {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .tasks-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      
      h1 {
        color: #6d3bf7;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .add-btn {
        background: #6d3bf7;
        color: white;
        border: none;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }
    
    .task-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      
      &.completed {
        opacity: 0.6;
        
        .task-text {
          text-decoration: line-through;
        }
      }
    }
    
    .task-status {
      color: #6d3bf7;
    }
    
    .task-text {
      flex: 1;
    }
    
    .task-priority {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      
      &.high { background: #ffebee; color: #c62828; }
      &.medium { background: #fff3e0; color: #ef6c00; }
      &.low { background: #e8f5e8; color: #2e7d32; }
    }
  `]
})
export class TasksComponent {}