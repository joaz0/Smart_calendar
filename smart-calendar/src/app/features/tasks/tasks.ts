import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatMenuModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.scss']
})
export class TasksComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  tasks: any[] = [];
  filteredTasks: any[] = [];
  searchTerm = '';
  selectedFilter = 'all';
  selectedPriority = 'all';
  isLoading = false;
  
  filters = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'completed', label: 'Concluídas' },
    { value: 'overdue', label: 'Atrasadas' }
  ];
  
  priorities = [
    { value: 'all', label: 'Todas as Prioridades' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Média' },
    { value: 'low', label: 'Baixa' }
  ];
  
  constructor(
    private router: Router,
    private taskService: TaskService
  ) {}
  
  ngOnInit() {
    this.loadTasks();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadTasks() {
    this.isLoading = true;
    
    // Simular carregamento de tarefas
    setTimeout(() => {
      this.tasks = this.getMockTasks();
      this.applyFilters();
      this.isLoading = false;
    }, 500);
  }
  
  getMockTasks() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return [
      {
        id: '1',
        title: 'Revisar relatório mensal',
        description: 'Revisar e aprovar o relatório de vendas do mês',
        completed: false,
        priority: 'high',
        dueDate: today,
        category: 'work',
        tags: ['relatório', 'vendas']
      },
      {
        id: '2',
        title: 'Preparar apresentação',
        description: 'Criar slides para a reunião de segunda-feira',
        completed: false,
        priority: 'medium',
        dueDate: tomorrow,
        category: 'work',
        tags: ['apresentação', 'reunião']
      },
      {
        id: '3',
        title: 'Enviar emails',
        description: 'Responder emails pendentes da semana',
        completed: true,
        priority: 'low',
        dueDate: yesterday,
        category: 'communication',
        tags: ['email', 'comunicação']
      },
      {
        id: '4',
        title: 'Agendar consulta médica',
        description: 'Marcar check-up anual',
        completed: false,
        priority: 'medium',
        dueDate: null,
        category: 'personal',
        tags: ['saúde', 'pessoal']
      },
      {
        id: '5',
        title: 'Estudar Angular',
        description: 'Completar curso de Angular avançado',
        completed: false,
        priority: 'low',
        dueDate: null,
        category: 'learning',
        tags: ['estudo', 'programação']
      }
    ];
  }
  
  applyFilters() {
    let filtered = [...this.tasks];
    
    // Filtro por texto
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(term) ||
        task.description?.toLowerCase().includes(term) ||
        task.tags?.some((tag: string) => tag.toLowerCase().includes(term))
      );
    }
    
    // Filtro por status
    switch (this.selectedFilter) {
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'overdue':
        const now = new Date();
        filtered = filtered.filter(task => 
          !task.completed && task.dueDate && task.dueDate < now
        );
        break;
    }
    
    // Filtro por prioridade
    if (this.selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === this.selectedPriority);
    }
    
    // Ordenar por prioridade e data
    filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      
      return a.dueDate ? -1 : 1;
    });
    
    this.filteredTasks = filtered;
  }
  
  onSearch() {
    this.applyFilters();
  }
  
  onFilterChange(filter: string) {
    this.selectedFilter = filter;
    this.applyFilters();
  }
  
  onPriorityChange(priority: string) {
    this.selectedPriority = priority;
    this.applyFilters();
  }
  
  createTask() {
    const title = prompt('Digite o título da tarefa:');
    if (title) {
      const newTask = {
        id: Date.now().toString(),
        title,
        description: '',
        completed: false,
        priority: 'medium',
        dueDate: null,
        category: 'general',
        tags: []
      };
      this.tasks.unshift(newTask);
      this.applyFilters();
    }
  }
  
  toggleTask(task: any) {
    task.completed = !task.completed;
    this.applyFilters();
  }
  
  editTask(task: any) {
    const newTitle = prompt('Editar título:', task.title);
    if (newTitle && newTitle !== task.title) {
      task.title = newTitle;
      this.applyFilters();
    }
  }
  
  deleteTask(task: any) {
    if (confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
      this.applyFilters();
    }
  }
  
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  }
  
  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  }
  
  getCategoryLabel(category: string): string {
    switch (category) {
      case 'work': return 'Trabalho';
      case 'personal': return 'Pessoal';
      case 'communication': return 'Comunicação';
      case 'learning': return 'Aprendizado';
      default: return 'Geral';
    }
  }
  
  isOverdue(task: any): boolean {
    return !task.completed && task.dueDate && task.dueDate < new Date();
  }
  
  formatDueDate(date: Date): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Amanhã';
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  }
}

// Componente legado
@Component({
  selector: 'app-tasks-legacy',
  standalone: true,
  imports: [CommonModule],
  template: `
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
export class TasksLegacyComponent {}