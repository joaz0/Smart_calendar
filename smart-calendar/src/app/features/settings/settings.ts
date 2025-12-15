import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
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
export class SettingsComponent implements OnInit {
  user: any = {
    name: 'Usuário',
    email: 'user@example.com',
    avatar: null
  };
  
  settings = {
    darkMode: false,
    notifications: true,
    emailNotifications: true,
    soundNotifications: false,
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    workingHours: {
      start: '09:00',
      end: '18:00'
    },
    weekStart: 'monday'
  };
  
  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loadUserData();
    this.loadSettings();
  }
  
  loadUserData() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
  }
  
  loadSettings() {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
  }
  
  saveSettings() {
    localStorage.setItem('userSettings', JSON.stringify(this.settings));
    alert('Configurações salvas com sucesso!');
  }
  
  toggleDarkMode() {
    this.settings.darkMode = !this.settings.darkMode;
    this.themeService.toggleTheme();
    this.saveSettings();
  }
  
  updateProfile() {
    const newName = prompt('Digite seu nome:', this.user.name);
    if (newName && newName !== this.user.name) {
      this.user.name = newName;
      alert('Perfil atualizado com sucesso!');
    }
  }
  
  changePassword() {
    const currentPassword = prompt('Digite sua senha atual:');
    if (currentPassword) {
      const newPassword = prompt('Digite a nova senha:');
      if (newPassword) {
        const confirmPassword = prompt('Confirme a nova senha:');
        if (newPassword === confirmPassword) {
          alert('Senha alterada com sucesso!');
        } else {
          alert('As senhas não coincidem!');
        }
      }
    }
  }
  
  exportData() {
    const data = {
      user: this.user,
      settings: this.settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agenda-rapido-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  logout() {
    if (confirm('Tem certeza que deseja sair?')) {
      this.authService.logout();
      this.router.navigate(['/auth']);
    }
  }
}