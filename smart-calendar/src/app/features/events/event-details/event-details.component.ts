import { Component, Input, Output, EventEmitter } from '@angular/core.component';
import { CommonModule, DatePipe } from '@angular/common.component';
import { AnyObject } from '@core/models/common-interfaces.component';


@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './event-details.html',
  styleUrl: './event-details.scss',
})
export class EventDetailsComponent {
  @Input() event: any | null = null;
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();

  editEvent(ev: any): void {
    this.edit.emit(ev);
  }

  deleteEvent(ev: any): void {
    this.remove.emit(ev);
  }
}
