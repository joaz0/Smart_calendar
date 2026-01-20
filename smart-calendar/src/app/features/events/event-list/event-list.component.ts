import { Component, EventEmitter, Output } from '@angular/core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent {
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
