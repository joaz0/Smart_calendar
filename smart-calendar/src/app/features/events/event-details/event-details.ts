import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './event-details.html',
  styleUrl: './event-details.scss',
})
export class EventDetails {
  @Input() event: any | null = null;
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();

  editEvent(ev: unknown): void {
    this.edit.emit(ev);
  }

  deleteEvent(ev: unknown): void {
    this.remove.emit(ev);
  }
}
