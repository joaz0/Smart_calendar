import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-week-view',
  standalone: true,
  imports: [DatePipe, MatIconModule, MatProgressSpinnerModule, MatButtonModule, MatMenuModule, MatDividerModule],
  templateUrl: './week-view.html',
  styleUrl: './week-view.scss',
})
export class WeekView {
  @Input() events: any[] = [];
  @Input() selectedDate: Date = new Date();
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() eventClicked = new EventEmitter<any>();
  
  startOfWeek: Date = this.getStartOfWeek(new Date());
  weekDays: { date: Date; events: any[] }[] = [];
  showSummary = true;
  isLoading = false;
  timeSlots: number[] = Array.from({ length: 24 }, (_, i) => i);
  visibleDays: Date[] = [];
  showWeekends = true;
  showAllDay = true;

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

  startEventDrag(_event: any, mouseEvent: MouseEvent) {
    mouseEvent.preventDefault();
  }

  startResize(_event: any, direction: string, mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
  }

  getTotalEvents(): number {
    return this.weekDays.reduce((sum, day) => sum + day.events.length, 0);
  }

  getTotalHours(): number {
    return 0;
  }

  getTotalTasks(): number {
    return 0;
  }

  generateWeeklyReport() {
    console.log('Generating weekly report...');
  }

  getDayIndicators(day: any): any[] {
    return [];
  }

  trackByHour(index: number, hour: number): number {
    return hour;
  }

  trackByDay(index: number, day: any): number {
    return day.date ? day.date.getTime() : day.getTime();
  }

  trackByEvent(index: number, event: any): any {
    return event.id || index;
  }

  isCurrentHour(hour: number): boolean {
    return new Date().getHours() === hour;
  }

  formatHour(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  isToday(day: any): boolean {
    const today = new Date();
    const date = day.date || day;
    return date.toDateString() === today.toDateString();
  }

  isWeekend(day: any): boolean {
    const date = day.date || day;
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  getDayAriaLabel(day: Date): string {
    return day.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  isBusinessHour(hour: number): boolean {
    return hour >= 9 && hour < 18;
  }

  createEventAt(day: Date, hour: number): void {
    console.log('Create event at', day, hour);
  }

  getCurrentTimePosition(): number {
    const now = new Date();
    const minutes = now.getMinutes();
    return (minutes / 60) * 100;
  }

  getEventsForSlot(day: Date, hour: number): any[] {
    return [];
  }

  getEventHeight(_event: any): number {
    return 60;
  }

  getEventTop(_event: any): number {
    return 0;
  }

  getEventLeft(_event: any): number {
    return 0;
  }

  getEventWidth(_event: any): number {
    return 100;
  }

  isMultiDayEvent(_event: any): boolean {
    return false;
  }

  hasConflicts(_event: any): boolean {
    return false;
  }

  getEventTooltip(_event: any): string {
    return event.title || '';
  }

  openEvent(_event: any): void {
    console.log('Open event', event);
  }

  previousWeek() {
    this.startOfWeek.setDate(this.startOfWeek.getDate() - 7);
    this.generateWeekDays();
  }

  nextWeek() {
    this.startOfWeek.setDate(this.startOfWeek.getDate() + 7);
    this.generateWeekDays();
  }

  getWeekTitle(): string {
    return `Semana ${this.getWeekNumber()}`;
  }

  getWeekRange(): string {
    const end = new Date(this.startOfWeek);
    end.setDate(end.getDate() + 6);
    return `${this.startOfWeek.toLocaleDateString('pt-BR')} - ${end.toLocaleDateString('pt-BR')}`;
  }

  getWeekNumber(): number {
    const date = new Date(this.startOfWeek);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  goToToday() {
    this.startOfWeek = this.getStartOfWeek(new Date());
    this.generateWeekDays();
  }

  addEvent() {
    console.log('Add event');
  }

  toggleWeekends() {
    this.showWeekends = !this.showWeekends;
  }

  toggleAllDay() {
    this.showAllDay = !this.showAllDay;
  }

  exportWeek() {
    console.log('Export week');
  }

  hasAllDayEvents(): boolean {
    return false;
  }

  getAllDayEventsForDay(day: any): any[] {
    return [];
  }
}
