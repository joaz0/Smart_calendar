import { Component, Input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="empty-state">
      <mat-icon>{{ icon }}</mat-icon>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
      color: var(--text-secondary);
    }
    mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
      opacity: 0.6;
    }
    h3 {
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }
    p {
      margin: 0;
      opacity: 0.8;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'Nenhum item encontrado';
  @Input() message = 'Não há dados para exibir no momento.';
  @Input() primaryAction: any;
  @Input() secondaryAction: any;
}