import { Component, Input } from '@angular/core';



@Component({
  selector: 'app-ai-suggestions-panel',
  standalone: true,
  imports: [],
  templateUrl: './ai-suggestions-panel.component.html',
  styleUrls: ['./ai-suggestions-panel.component.scss'],
})
export class AiSuggestionsPanelComponent {
  @Input() suggestions: unknown[] = [];
  @Input() showApply = true;

  apply(s: unknown): void {
    // placeholder: aplicar sugestão
    console.log('apply suggestion', s);
  }
}
