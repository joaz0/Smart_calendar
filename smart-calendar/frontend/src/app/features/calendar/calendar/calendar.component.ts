import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MonthViewComponent } from '../month-view/month-view.component';
import { WeekViewComponent } from '../week-view/week-view.component';
import { DayViewComponent } from '../day-view/day-view.component';
import { CalendarEvent } from '@shared/types/dto';


@Component({
  standalone: true,
  selector: 'app-calendar',
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatCheckboxModule,
    MonthViewComponent,
    WeekViewComponent,
    DayViewComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  currentView = 'month';
  currentPeriodTitle = 'Janeiro 2024';
  selectedDate = new Date();
  filteredEvents: CalendarEvent[] = [];
  categories: { name: string; color: string; visible: boolean }[] = [
    { name: 'Trabalho', color: '#3B82F6', visible: true },
    { name: 'Pessoal', color: '#10B981', visible: true }
  ];

  previousPeriod(): void {
    // TODO: Implementar navegação para período anterior
  }
  
  nextPeriod(): void {
    // TODO: Implementar navegação para próximo período
  }
  
  goToToday(): void { 
    this.selectedDate = new Date(); 
  }
  
  changeView(viewEvent: { value: string }): void { 
    this.currentView = viewEvent.value; 
  }
  
  createEvent(): void {
    // TODO: Implementar criação de evento
  }
  
  onDateSelected(date: Date): void { 
    this.selectedDate = date; 
  }
  
  onEventClicked(event: CalendarEvent): void {
    // TODO: Implementar ação ao clicar no evento
    console.log('Event clicked:', event);
  }
  applyFilters() {
    // This logic is flawed, as it filters an already filtered list.
    // It should filter the original source of events.
    // Also, `e.category` does not exist on CalendarEvent. It's `category_id`.
    // This will be fixed when the event service is implemented.
  }
}
