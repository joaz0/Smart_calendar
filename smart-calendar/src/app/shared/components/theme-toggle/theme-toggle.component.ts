import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="theme-toggle"
      (click)="toggleTheme()"
      [attr.aria-label]="isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <span class="icon">
        {{ isDarkMode() ? '☀️' : '🌙' }}
      </span>
    </button>
  `,
  styles: [`
    .theme-toggle {
      background: var(--surface-glass);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-full);
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
      backdrop-filter: blur(10px);
      
      &:hover {
        background: var(--surface-secondary);
        transform: scale(1.05);
      }
      
      .icon {
        font-size: 1.2rem;
        transition: transform var(--transition-fast);
      }
      
      &:active .icon {
        transform: scale(0.9);
      }
    }
  `]
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  
  isDarkMode = this.themeService.isDarkMode;
  
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}