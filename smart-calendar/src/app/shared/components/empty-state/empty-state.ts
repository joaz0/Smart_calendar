import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.html',
  styleUrls: ['./empty-state.scss']
})
export class EmptyStateComponent {
  @Input() icon = '🤷';
  @Input() title = 'No Items Found';
  @Input() description = 'There are no items to display at this time.';
  @Input() actionText = 'Add New';
  @Input() suggestions: string[] = []; // Array de strings simples
  @Input() showAction = false;
  @Input() variant: 'default' | 'compact' | 'inline' = 'default';
  
  @Output() action = new EventEmitter<void>();
  @Output() suggestionClick = new EventEmitter<string>(); // Emite a string completa

  onActionClick(): void {
    this.action.emit();
  }

  onSuggestionClick(suggestion: string): void {
    this.suggestionClick.emit(suggestion); // Emite a string completa
  }
}