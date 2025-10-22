import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-scheduling-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-scheduling-assistant.html',
  styleUrls: ['./ai-scheduling-assistant.scss'],
})
export class AiSchedulingAssistant {
  suggestions: Array<{ time: string; reason: string }> = [];

  constructor() {
    // exemplo estático para evitar erros de template durante build
    this.suggestions = [
      { time: '09:00', reason: 'Disponível pela manhã' },
      { time: '14:00', reason: 'Janela livre à tarde' },
    ];
  }

  applySuggestion(s: { time: string; reason: string }) {
    console.log('Aplicando sugestão', s);
    // lógica de aplicação ficaria aqui
  }
}
