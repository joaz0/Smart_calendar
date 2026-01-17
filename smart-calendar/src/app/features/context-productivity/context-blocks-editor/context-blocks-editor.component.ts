import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-context-blocks-editor',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './context-blocks-editor.component.html',
  styleUrl: './context-blocks-editor.component.scss'
})
export class ContextBlocksEditorComponent {
  blocks = [
    { id: '1', name: 'Foco Profundo', color: '#6A1B9A', startTime: '09:00', endTime: '11:00' },
    { id: '2', name: 'Reuniões', color: '#2196F3', startTime: '11:00', endTime: '12:00' },
    { id: '3', name: 'Almoço', color: '#4CAF50', startTime: '12:00', endTime: '13:00' },
    { id: '4', name: 'Criatividade', color: '#FF9800', startTime: '14:00', endTime: '16:00' }
  ];
}
