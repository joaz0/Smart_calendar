// Angular Core
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

// Angular Common
import { CommonModule, DatePipe } from '@angular/common';

// Angular Forms
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

// Shared Components
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

// Models
import { CalendarEvent } from '../../../core/models/event.model';
import { Task } from '../../../core/models/task.model';


@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    EmptyStateComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayViewComponent {
  @Input() events: CalendarEvent[] = [];
  @Input() selectedDate: Date = new Date();
  @Output() eventClicked = new EventEmitter<CalendarEvent>();
  
  day: Date = new Date();
  dayTasks: Task[] = [];
  is24Hour = true;
  isLoading = false;
  currentDate = new Date();
  weatherData: { condition: string; temperature: number } | null = null;
  showWeather = false;
  allDayEvents: CalendarEvent[] = [];
  timeSlots: number[] = Array.from({ length: 24 }, (_, i) => i);
  showHint = false;
  hintHour: number | null = null;
  slots: { time: string; events: CalendarEvent[] }[] = [
    { time: '08:00', events: [] },
    { time: '09:00', events: [] },
    { time: '10:00', events: [] },
    { time: '11:00', events: [] },
    { time: '12:00', events: [] },
    { time: '13:00', events: [] },
    { time: '14:00', events: [] },
    { time: '15:00', events: [] },
    { time: '16:00', events: [] },
    { time: '17:00', events: [] },
  ];

  createEventAt(time: string | number) {
    const timeStr = typeof time === 'number' ? `${time}:00` : time;
    alert(`Criar evento às ${timeStr}`);
  }

  previousDay() {
    this.currentDate = new Date(this.currentDate.getTime() - 24 * 60 * 60 * 1000);
  }

  nextDay() {
    this.currentDate = new Date(this.currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  goToToday() {
    this.currentDate = new Date();
  }

  isTomorrow(date: Date): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  }

  isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  }

  toggleTimeFormat() {
    this.is24Hour = !this.is24Hour;
  }

  toggleWeatherInfo() {
    this.showWeather = !this.showWeather;
  }

  exportDay() {
    console.log('Export day');
  }

  printDay() {
    window.print();
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = { high: 'Alta', medium: 'Média', low: 'Baixa' };
    return labels[priority] || priority;
  }

  editTask(task: Task) {
    console.log('Edit task', task);
  }

  getTotalEvents(): number {
    return 0;
  }

  getTotalScheduledHours(): number {
    return 0;
  }

  getCompletedTasksCount(): number {
    return this.dayTasks.filter(t => t.completed).length;
  }

  getFreeTimeHours(): number {
    return 0;
  }

  isEmpty(): boolean {
    return this.slots.every(s => s.events.length === 0) && this.dayTasks.length === 0;
  }

  addEvent() {
    console.log('Add event');
  }

  addTask() {
    console.log('Add task');
  }

  getWeatherIcon(condition: string): string {
    return 'wb_sunny';
  }

  trackByEvent(index: number, event: CalendarEvent): string {
    return event.id;
  }

  trackByHour(index: number, hour: number): number {
    return hour;
  }

  trackByTask(index: number, task: Task): string {
    return task.id;
  }

  getEventTooltip(evt: CalendarEvent): string {
    return evt.title || '';
  }

  openEvent(evt: CalendarEvent) {
    console.log('Open event', evt);
  }

  isCurrentHour(hour: number): boolean {
    return new Date().getHours() === hour;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  formatHour(hour: number): string {
    if (this.is24Hour) {
      return `${hour.toString().padStart(2, '0')}:00`;
    }
    const h = hour % 12 || 12;
    return `${h}:00`;
  }

  getTimePeriod(hour: number): string {
    return hour < 12 ? 'AM' : 'PM';
  }

  isBusinessHour(hour: number): boolean {
    return hour >= 9 && hour < 18;
  }

  isBreakTime(hour: number): boolean {
    return hour === 12;
  }

  getCurrentTimePosition(): number {
    const now = new Date();
    const minutes = now.getMinutes();
    return (minutes / 60) * 100;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  getEventsForHour(hour: number): CalendarEvent[] {
    return [];
  }

  getEventHeight(_event: any): number {
    return 60;
  }

  getEventTop(_event: any): number {
    return 0;
  }

  hasTimeConflict(_event: any): boolean {
    return false;
  }

  isPastEvent(_event: any): boolean {
    return false;
  }

  isCurrentEvent(_event: any): boolean {
    return false;
  }

  editEvent(evt: CalendarEvent) {
    console.log('Edit event', evt);
  }

  onEventDragStart(evt: CalendarEvent, dragEvent: DragEvent) {
    console.log('Drag start', evt);
  }

  getEventDuration(_event: any): string {
    return '1h';
  }

  quickEditEvent(evt: CalendarEvent, mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
    console.log('Quick edit', evt);
  }

  deleteEvent(evt: CalendarEvent, mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
    console.log('Delete event', evt);
  }

  startResize(evt: CalendarEvent, type: string, mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
    console.log('Start resize', evt, type);
  }

  showCreateHint(hour: number) {
    this.showHint = true;
    this.hintHour = hour;
  }

  hideCreateHint() {
    this.showHint = false;
    this.hintHour = null;
  }

  isTaskOverdue(task: Task): boolean {
    return false;
  }

  toggleTaskCompletion(task: Task) {
    console.log('Toggle task', task);
  }
}
