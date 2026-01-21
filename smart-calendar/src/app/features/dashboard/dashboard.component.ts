import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { UserService, UserProfile } from '../../core/services/user.service';
import { EventService } from '../../core/services/event.service';
import { TaskService } from '../../core/services/task.service';
import { PersonalTimeGuardianComponent } from '../wellness/personal-time-guardian/personal-time-guardian.component';
import { CalendarEvent } from '../../core/models/event.model';
import { Task } from '../../core/models/task.model';

interface AIInsight {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, MatCardModule, MatButtonModule, MatIconModule, MatCheckboxModule, FormsModule, PersonalTimeGuardianComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private userService = inject(UserService);
  private eventService = inject(EventService);
  private taskService = inject(TaskService);

  private destroy$ = new Subject<void>();
  
  user: Partial<UserProfile> = { name: 'Usuário' };
  currentDate = new Date();
  
  todayStats = {
    events: 0,
    tasks: 0,
    productivity: 0,
    wellness: 'Bom'
  };
  
  todayEvents: CalendarEvent[] = [];
  quickTasks: Task[] = [];
  aiInsights: AIInsight[] = [
    {
      icon: 'schedule',
      title: 'Otimização de Tempo',
      description: 'Você tem 2 horas livres entre as reuniões hoje.'
    },
    {
      icon: 'trending_up',
      title: 'Produtividade',
      description: 'Sua produtividade aumentou 15% esta semana.'
    }
  ];
  
  ngOnInit() {
    this.loadUserData();
    this.loadTodayData();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadUserData() {
    this.userService.getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.user = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            avatar: profile.avatar
          };
        },
        error: () => {
          this.user = { name: 'Usuário' };
        }
      });
  }
  
  private loadTodayData() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Carregar eventos de hoje
    this.eventService.getEventsByDateRange(today, tomorrow)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (events) => {
          this.todayEvents = events;
          this.todayStats.events = events.length;
        },
        error: () => {
          this.todayEvents = this.getMockEvents();
          this.todayStats.events = this.todayEvents.length;
        }
      });
    
    // Carregar tarefas
    this.loadTasks();
    
    // Carregar estatísticas
    this.userService.getStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.todayStats.tasks = stats.pending_tasks || 0;
          this.todayStats.productivity = stats.productivity_score || 0;
        },
        error: () => {
          this.todayStats.tasks = 5;
          this.todayStats.productivity = 85;
        }
      });
  }
  
  private loadTasks() {
    // Simular carregamento de tarefas
    this.quickTasks = [
      { id: '1', title: 'Revisar relatório mensal', completed: false, priority: 'high', status: 'pending', category: 'general', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: '2', title: 'Preparar apresentação', completed: false, priority: 'medium', status: 'pending', category: 'general', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: '3', title: 'Responder emails', completed: true, priority: 'low', status: 'completed', category: 'general', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];
  }
  
  private getMockEvents(): CalendarEvent[] {
    const now = new Date();
    return [
      {
        id: '1',
        title: 'Reunião de equipe',
        description: 'Reunião semanal da equipe',
        startDate: new Date(new Date().setHours(9, 0)),
        endDate: new Date(new Date().setHours(10, 0)),
        allDay: false,
        location: 'Sala 1',
        createdBy: 'system',
        createdAt: now,
        updatedAt: now,
        category: { id: '1', name: 'Trabalho', color: '#4caf50', createdBy: 'system', createdAt: now, updatedAt: now }
      },
      {
        id: '2',
        title: 'Apresentação do projeto',
        description: 'Apresentar resultados do trimestre',
        startDate: new Date(new Date().setHours(14, 30)),
        endDate: new Date(new Date().setHours(15, 30)),
        allDay: false,
        location: 'Auditório',
        createdBy: 'system',
        createdAt: now,
        updatedAt: now,
        category: { id: '2', name: 'Apresentação', color: '#ff9800', createdBy: 'system', createdAt: now, updatedAt: now }
      }
    ];
  }
  
  createEvent() {
    this.router.navigate(['/app/calendar'], { queryParams: { action: 'create' } });
  }
  
  refreshSchedule() {
    this.loadTodayData();
  }
  
  addTask() {
    const title = prompt('Digite o título da tarefa:');
    if (title) {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        completed: false,
        priority: 'medium',
        status: 'pending',
        category: 'general',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.quickTasks.unshift(newTask);
      this.todayStats.tasks++;
    }
  }
  
  toggleTask(task: Task): void {
    task.completed = !task.completed;
    if (task.completed) {
      this.todayStats.tasks--;
    } else {
      this.todayStats.tasks++;
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
  
  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return 'priority_high';
      case 'medium': return 'remove';
      case 'low': return 'keyboard_arrow_down';
      default: return 'remove';
    }
  }
}
// Componente legado mantido para compatibilidade
@Component({
  selector: 'app-dashboard-legacy',
  standalone: true,
  imports: [],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1><i class="fas fa-home"></i> Dashboard</h1>
        <p>Bem-vindo ao seu painel de controle</p>
      </div>
      
      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header">
            <i class="fas fa-calendar-day"></i>
            <h3>Eventos Hoje</h3>
          </div>
          <div class="card-content">
            <span class="metric">5</span>
            <span class="label">eventos agendados</span>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <i class="fas fa-tasks"></i>
            <h3>Tarefas</h3>
          </div>
          <div class="card-content">
            <span class="metric">12</span>
            <span class="label">pendentes</span>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <i class="fas fa-chart-line"></i>
            <h3>Produtividade</h3>
          </div>
          <div class="card-content">
            <span class="metric">85%</span>
            <span class="label">esta semana</span>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <i class="fas fa-clock"></i>
            <h3>Tempo Focado</h3>
          </div>
          <div class="card-content">
            <span class="metric">6.5h</span>
            <span class="label">hoje</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    /* Desktop */
    @media (min-width: 992px) {
      .dashboard {
        padding: 2rem;
      }
      
      .dashboard-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
      }
      
      .card {
        padding: 1.5rem;
      }
    }
    
    /* Tablet */
    @media (min-width: 768px) and (max-width: 991px) {
      .dashboard {
        padding: 1.5rem;
      }
      
      .dashboard-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem;
      }
      
      .card {
        padding: 1.25rem;
      }
    }
    
    /* Mobile */
    @media (max-width: 767px) {
      .dashboard {
        padding: 1rem;
      }
      
      .dashboard-header {
        margin-bottom: 1.5rem;
        text-align: center;
      }
      
      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .card {
        padding: 1rem;
      }
    }
    
    .dashboard-header {
      margin-bottom: 2rem;
      
      h1 {
        color: rgba(255,255,255,0.9);
        margin: 0 0 0.5rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: center;
        
        @media (min-width: 768px) {
          justify-content: flex-start;
          font-size: 2rem;
        }
        
        @media (max-width: 767px) {
          font-size: 1.5rem;
          flex-direction: column;
          gap: 0.25rem;
        }
      }
      
      p {
        color: rgba(255,255,255,0.7);
        margin: 0;
        
        @media (max-width: 767px) {
          font-size: 0.9rem;
        }
      }
    }
    
    .dashboard-grid {
      display: grid;
    }
    
    .card {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
        background: rgba(255,255,255,0.15);
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
      }
    }
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      
      i {
        color: #4facfe;
        font-size: 1.2rem;
        
        @media (max-width: 767px) {
          font-size: 1.1rem;
        }
      }
      
      h3 {
        margin: 0;
        color: rgba(255,255,255,0.9);
        font-size: 1rem;
        
        @media (max-width: 767px) {
          font-size: 0.9rem;
        }
      }
    }
    
    .card-content {
      text-align: center;
      
      .metric {
        display: block;
        font-weight: bold;
        color: #4facfe;
        margin-bottom: 0.25rem;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        
        @media (min-width: 768px) {
          font-size: 2rem;
        }
        
        @media (max-width: 767px) {
          font-size: 1.75rem;
        }
      }
      
      .label {
        color: rgba(255,255,255,0.7);
        
        @media (min-width: 768px) {
          font-size: 0.9rem;
        }
        
        @media (max-width: 767px) {
          font-size: 0.8rem;
        }
      }
    }
  `]
})
export class DashboardLegacyComponent {}
