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
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-header {
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
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transition: transform 0.2s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
    }
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      
      i {
        color: #6d3bf7;
        font-size: 1.2rem;
      }
      
      h3 {
        margin: 0;
        color: #333;
        font-size: 1rem;
      }
    }
    
    .card-content {
      text-align: center;
      
      .metric {
        display: block;
        font-size: 2rem;
        font-weight: bold;
        color: #6d3bf7;
        margin-bottom: 0.25rem;
      }
      
      .label {
        color: #666;
        font-size: 0.9rem;
      }
    }
  `]
})
export class DashboardComponent {}