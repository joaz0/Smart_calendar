import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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
export class DashboardComponent {}