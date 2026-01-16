import { Component, EventEmitter, Output } from '@angular/core.component';
import { DatePipe } from '@angular/common.component';


@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss',
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
