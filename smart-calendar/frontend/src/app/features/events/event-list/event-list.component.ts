import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { EventService } from '../../../core/services/event.service';
import { CalendarEvent } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  events$: Observable<CalendarEvent[]>;

  constructor(private readonly eventService: EventService) {}

  ngOnInit(): void {
    this.events$ = this.eventService.getAll();
  }

  createEvent(): void {
    // Placeholder para emitir evento ou abrir modal
    console.log('createEvent called');
  }

  openDetails(ev: CalendarEvent): void {
    console.log('openDetails', ev);
  }
}
