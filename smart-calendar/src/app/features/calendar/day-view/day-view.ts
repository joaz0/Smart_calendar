import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './day-view.html',
  styleUrl: './day-view.scss',
})
export class DayView {
  day: Date = new Date();
  slots: { time: string; events: any[] }[] = [
    { time: '08:00', events: [] },
    { time: '09:00', events: [] },
    { time: '10:00', events: [] },
    { time: '11:00', events: [] },
    { time: '12:00', events: [] },
    { time: '13:00', events: [] },
    { time: '14:00', events: [] },
    { time: '15:00', events: [] },
    { time: '16:00', events: [] },
    { time: '17:00', events: [] },
  ];

  createEventAt(time: string) {
    // Implementação real: abrir dialog de evento
    alert(`Criar evento às ${time}`);
  }
}
