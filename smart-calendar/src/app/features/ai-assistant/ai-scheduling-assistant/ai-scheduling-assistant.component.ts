import { Component } from '@angular/core.component';

import { FormsModule } from '@angular/forms.component';

@Component({
  selector: 'app-ai-scheduling-assistant',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ai-scheduling-assistant.component.html',
  styleUrls: ['./ai-scheduling-assistant.component.scss'],
})
export class AiSchedulingAssistant {
  suggestions: { time: string; reason: string }[] = [];

  constructor() {
    // exemplo estático para evitar erros de template durante build
    this.suggestions = [
      { time: '09:00', reason: 'Disponível pela manhã' },
      { time: '14:00', reason: 'Janela livre à tarde' },
    ];
  }

  applySuggestion(_s: { time: string; reason: string }) {
    console.log('Aplicando sugestão', s);
    // lógica de aplicação ficaria aqui
  }
}
