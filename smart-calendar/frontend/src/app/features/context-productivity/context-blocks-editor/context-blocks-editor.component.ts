import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MATERIAL_COLORS } from '../../../shared/tokens/color-tokens';

@Component({
  standalone: true,
  selector: 'app-context-blocks-editor',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './context-blocks-editor.component.html',
  styleUrl: './context-blocks-editor.component.scss'
})
export class ContextBlocksEditorComponent {
  blocks = [
    { id: '1', name: 'Foco Profundo', color: MATERIAL_COLORS.deepPurple, startTime: '09:00', endTime: '11:00' },
    { id: '2', name: 'Reuniões', color: MATERIAL_COLORS.blue, startTime: '11:00', endTime: '12:00' },
    { id: '3', name: 'Almoço', color: MATERIAL_COLORS.green, startTime: '12:00', endTime: '13:00' },
    { id: '4', name: 'Criatividade', color: MATERIAL_COLORS.orange, startTime: '14:00', endTime: '16:00' }
  ];
}
