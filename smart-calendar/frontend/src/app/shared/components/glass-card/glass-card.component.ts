import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './glass-card.component.html',
  styleUrls: ['./glass-card.component.scss'],
})
export class GlassCardComponent {
  @Input() title?: string;
  @Input() icon?: string;
  @Input() iconColor = 'var(--accent-color)';
  @Input() hoverable = true;
  @Input() clickable = false;
  @Input() hasFooter = false;
  @Input() ariaLabel?: string;
  @Output() cardClick = new EventEmitter<void>();

  headerId = `card-header-${Math.random().toString(36).substr(2, 9)}`;

  handleClick() {
    this.cardClick.emit();
  }
}
