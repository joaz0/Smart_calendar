import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  standalone: true,
  selector: 'app-calendar',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatButtonToggleModule, MatMenuModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar {
  currentView = 'month';
  currentPeriodTitle = '';
  categories: any[] = [];

  previousPeriod() {}
  nextPeriod() {}
  goToToday() {}
  changeView(view: string) { this.currentView = view; }
  createEvent() {}
  createTask() {}
  toggleCategory(cat: any) {}
}
