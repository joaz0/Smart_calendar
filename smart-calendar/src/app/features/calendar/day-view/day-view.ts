import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [CommonModule, DatePipe, MatIconModule, MatCheckboxModule, MatButtonModule, MatMenuModule, MatDividerModule, FormsModule, EmptyState, LoadingSpinner],
  templateUrl: './day-view.html',
  styleUrl: './day-view.scss',
})
export class DayView {
  @Input() events: any[] = [];
  @Input() selectedDate: Date = new Date();
  @Output() eventClicked = new EventEmitter<any>();
  
  day: Date = new Date();
  dayTasks: any[] = [];
  is24Hour = true;
  isLoading = false;
  currentDate = new Date();
  weatherData: any = null;
  showWeather = false;
  allDayEvents: any[] = [];
  timeSlots: number[] = Array.from({ length: 24 }, (_, i) => i);
  showHint = false;
  hintHour: number | null = null;
  slots: { time: string; events: any[] }[] = [
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
    const labels: any = { high: 'Alta', medium: 'Média', low: 'Baixa' };
    return labels[priority] || priority;
  }

  editTask(task: any) {
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

  trackByEvent(index: number, event: any): any {
    return event.id;
  }

  trackByHour(index: number, hour: number): number {
    return hour;
  }

  trackByTask(index: number, task: any): any {
    return task.id;
  }

  getEventTooltip(_event: any): string {
    return event.title || '';
  }

  openEvent(_event: any) {
    console.log('Open event', event);
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

  getEventsForHour(hour: number): any[] {
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

  editEvent(_event: any) {
    console.log('Edit event', event);
  }

  onEventDragStart(_event: any, dragEvent: DragEvent) {
    console.log('Drag start', event);
  }

  getEventDuration(_event: any): string {
    return '1h';
  }

  quickEditEvent(_event: any, mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
    console.log('Quick edit', event);
  }

  deleteEvent(_event: any, mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
    console.log('Delete event', event);
  }

  startResize(_event: any, type: string, mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
    console.log('Start resize', event, type);
  }

  showCreateHint(hour: number) {
    this.showHint = true;
    this.hintHour = hour;
  }

  hideCreateHint() {
    this.showHint = false;
    this.hintHour = null;
  }

  isTaskOverdue(task: any): boolean {
    return false;
  }

  toggleTaskCompletion(task: any) {
    console.log('Toggle task', task);
  }
}
