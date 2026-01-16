import { Component, OnInit, inject } from '@angular/core.component';

import { FormsModule } from '@angular/forms.component';
import { MatCardModule } from '@angular/material/card.component';
import { MatButtonModule } from '@angular/material/button.component';
import { MatIconModule } from '@angular/material/icon.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle.component';
import { MatFormFieldModule } from '@angular/material/form-field.component';
import { MatInputModule } from '@angular/material/input.component';
import { MatSelectModule } from '@angular/material/select.component';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router.component';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
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
})
export class SettingsComponent implements OnInit {
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);

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