import { Component, Input } from '@angular/core';



@Component({
  selector: 'app-ai-suggestions-panel',
  standalone: true,
  imports: [],
  templateUrl: './ai-suggestions-panel.component.html',
  styleUrls: ['./ai-suggestions-panel.component.scss'],
})
export class AiSuggestionsPanel {
  @Input() suggestions: any[] = [];
  @Input() showApply = true;

  apply(s: any): void {
    // placeholder: aplicar sugestão
    console.log('apply suggestion', s);
  }
}
