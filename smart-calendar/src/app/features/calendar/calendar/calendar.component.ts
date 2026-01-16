import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MonthView } from '../month-view/month-view.component';
import { WeekView } from '../week-view/week-view.component';
import { DayView } from '../day-view/day-view.component';


@Component({
  standalone: true,
  selector: 'app-calendar',
  imports: [FormsModule, MatIconModule, MatButtonModule, MatButtonToggleModule, MatMenuModule, MatCheckboxModule, MonthView, WeekView, DayView],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class CalendarComponent {
  currentView = 'month';
  currentPeriodTitle = 'Janeiro 2024';
  selectedDate = new Date();
  filteredEvents: unknown[] = [];
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
  
  onEventClicked(_event: unknown): void {
    // TODO: Implementar ação ao clicar no evento
  }
  applyFilters() {
    this.filteredEvents = this.filteredEvents.filter(e => 
      this.categories.find(c => c.name === e.category)?.visible
    );
  }
}
