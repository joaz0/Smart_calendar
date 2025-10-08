import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss',
})
export class EventList {
  events: any[] = [];

  @Output() create = new EventEmitter<void>();

  createEvent(): void {
    this.create.emit();
  }

  openDetails(ev: any): void {
    // stub: abrir detalhe do evento
    console.log('openDetails', ev);
  }
}
