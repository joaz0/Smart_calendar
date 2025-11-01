import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="loading-spinner">
      <mat-spinner [diameter]="size"></mat-spinner>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    p {
      margin-top: 1rem;
      color: var(--text-secondary);
      text-align: center;
    }
  `]
})
export class LoadingSpinner {
  @Input() size = 40;
  @Input() message = '';
  @Input() showLogo = false;
}