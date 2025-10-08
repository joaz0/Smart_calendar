import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-suggestions-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-suggestions-panel.html',
  styleUrls: ['./ai-suggestions-panel.scss'],
})
export class AiSuggestionsPanel {
  @Input() suggestions: any[] = [];
  @Input() showApply = true;

  apply(s: any): void {
    // placeholder: aplicar sugestão
    console.log('apply suggestion', s);
  }
}
