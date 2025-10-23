import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="settings">
      <div class="settings-header">
        <h1><i class="fas fa-cog"></i> Configurações</h1>
        <p>Personalize sua experiência</p>
      </div>
      
      <div class="settings-content">
        <div class="setting-group">
          <h3>Aparência</h3>
          <div class="setting-item">
            <span>Tema escuro</span>
            <input type="checkbox">
          </div>
          <div class="setting-item">
            <span>Notificações</span>
            <input type="checkbox" checked>
          </div>
        </div>
        
        <div class="setting-group">
          <h3>Calendário</h3>
          <div class="setting-item">
            <span>Início da semana</span>
            <select>
              <option>Domingo</option>
              <option selected>Segunda-feira</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .settings-header {
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
    
    .setting-group {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      
      h3 {
        margin: 0 0 1rem 0;
        color: #333;
      }
    }
    
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #eee;
      
      &:last-child {
        border-bottom: none;
      }
    }
  `]
})
export class SettingsComponent {}