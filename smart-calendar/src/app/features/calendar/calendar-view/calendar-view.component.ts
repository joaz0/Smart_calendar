import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.scss',
})
export class CalendarViewComponent {
  currentDate: Date = new Date();

  prev(): void {
    const d = new Date(this.currentDate);
    d.setDate(d.getDate() - 1);
    this.currentDate = d;
  }

  today(): void {
    this.currentDate = new Date();
  }

  next(): void {
    const d = new Date(this.currentDate);
    d.setDate(d.getDate() + 1);
    this.currentDate = d;
  }
}
