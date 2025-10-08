import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-week-view',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './week-view.html',
  styleUrl: './week-view.scss',
})
export class WeekView {
  startOfWeek: Date = this.getStartOfWeek(new Date());
  weekDays: { date: Date; events: any[] }[] = [];

  constructor() {
    this.generateWeekDays();
  }

  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
  }

  generateWeekDays() {
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(this.startOfWeek);
      day.setDate(day.getDate() + i);
      this.weekDays.push({ date: day, events: [] });
    }
  }
}
