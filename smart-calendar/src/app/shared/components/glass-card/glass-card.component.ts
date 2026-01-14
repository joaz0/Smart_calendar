import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <article 
      class="glass-card" 
      [class.hoverable]="hoverable" 
      [class.clickable]="clickable"
      [attr.aria-label]="ariaLabel || title"
      [attr.role]="clickable ? 'button' : null"
      [attr.tabindex]="clickable ? '0' : null"
      (keydown.enter)="clickable && handleClick()"
      (keydown.space)="clickable && handleClick()">
      
      <header class="card-header" *ngIf="title || icon">
        <mat-icon *ngIf="icon" [style.color]="iconColor" [attr.aria-hidden]="true">{{ icon }}</mat-icon>
        <h3 [id]="headerId">{{ title }}</h3>
        <ng-content select="[header-actions]"></ng-content>
      </header>
      
      <div class="card-content" [attr.aria-labelledby]="title ? headerId : null">
        <ng-content></ng-content>
      </div>
      
      <footer class="card-footer" *ngIf="hasFooter">
        <ng-content select="[footer]"></ng-content>
      </footer>
    </article>
  `,
  styles: [`
    .glass-card {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(91, 11, 220, 0.85) 100%);
      border: 1px solid rgba(42, 0, 255, 0.3);
      border-radius: clamp(12px, 2vw, 16px);
      backdrop-filter: blur(20px) saturate(180%);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2), 0 0 30px rgba(91, 11, 220, 0.5);
      transition: all 0.25s ease;

      &.hoverable:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25), 0 0 40px rgba(91, 11, 220, 0.6);
        border-color: #5b0bdc;
      }

      &.clickable {
        cursor: pointer;

        &:focus-visible {
          outline: 3px solid var(--primary-400);
          outline-offset: 2px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
        &:hover { transform: none; }
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: clamp(0.5rem, 1.5vw, 0.75rem);
      padding: clamp(0.75rem, 2vw, 1rem);
      border-bottom: 1px solid rgba(42, 0, 255, 0.3);

      h3 {
        flex: 1;
        margin: 0;
        font-size: clamp(1rem, 2.5vw, 1.125rem);
        color: rgba(255, 255, 255, 0.95);
        font-weight: 600;
      }

      mat-icon {
        font-size: clamp(1.25rem, 3vw, 1.5rem);
        width: auto;
        height: auto;
      }
    }

    .card-content {
      padding: clamp(0.75rem, 2vw, 1rem);
    }

    .card-footer {
      padding: clamp(0.75rem, 2vw, 1rem);
      border-top: 1px solid rgba(42, 0, 255, 0.3);
    }

    @media (max-width: 767px) {
      .card-header {
        flex-wrap: wrap;
      }
    }
  `]
})
export class GlassCardComponent {
  @Input() title?: string;
  @Input() icon?: string;
  @Input() iconColor = '#a855f7';
  @Input() hoverable = true;
  @Input() clickable = false;
  @Input() hasFooter = false;
  @Input() ariaLabel?: string;

  headerId = `card-header-${Math.random().toString(36).substr(2, 9)}`;

  handleClick() {
    // Emit event or handle click
  }
}
