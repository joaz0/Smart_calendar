import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-scheduling-assistant',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ai-scheduling-assistant.component.html',
  styleUrls: ['./ai-scheduling-assistant.component.scss'],
})
export class AiSchedulingAssistantComponent {
  suggestions: { time: string; reason: string }[] = [];

  constructor() {
    // exemplo estático para evitar erros de template durante build
    this.suggestions = [
      { time: '09:00', reason: 'Disponível pela manhã' },
      { time: '14:00', reason: 'Janela livre à tarde' },
    ];
  }

  applySuggestion(suggestion: { time: string; reason: string }): void {
    console.log('Aplicando sugestão', suggestion);
    // lógica de aplicação ficaria aqui
  }
}
