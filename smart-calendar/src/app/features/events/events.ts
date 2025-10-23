import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="events">
      <div class="events-header">
        <h1><i class="fas fa-bookmark"></i> Eventos</h1>
        <button class="add-btn"><i class="fas fa-plus"></i> Novo Evento</button>
      </div>
      
      <div class="events-content">
        <div class="event-item">
          <div class="event-time">09:00</div>
          <div class="event-details">
            <h3>Reunião de equipe</h3>
            <p>Sala de conferências A</p>
          </div>
          <div class="event-category meeting">Reunião</div>
        </div>
        
        <div class="event-item">
          <div class="event-time">14:30</div>
          <div class="event-details">
            <h3>Apresentação do projeto</h3>
            <p>Auditório principal</p>
          </div>
          <div class="event-category presentation">Apresentação</div>
        </div>
        
        <div class="event-item">
          <div class="event-time">16:00</div>
          <div class="event-details">
            <h3>Call com cliente</h3>
            <p>Online - Zoom</p>
          </div>
          <div class="event-category call">Chamada</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .events {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .events-header {
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
    
    .event-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .event-time {
      font-weight: bold;
      color: #6d3bf7;
      min-width: 60px;
    }
    
    .event-details {
      flex: 1;
      
      h3 {
        margin: 0 0 0.25rem 0;
        color: #333;
      }
      
      p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }
    }
    
    .event-category {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      
      &.meeting { background: #e3f2fd; color: #1976d2; }
      &.presentation { background: #f3e5f5; color: #7b1fa2; }
      &.call { background: #e8f5e8; color: #388e3c; }
    }
  `]
})
export class EventsComponent {}