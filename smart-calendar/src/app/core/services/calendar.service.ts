import { Injectable } from '@angular/core';

export type CalendarView = 'month' | 'week' | 'day';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private currentViewSubject = new BehaviorSubject<CalendarView>('month');
  currentView$ = this.currentViewSubject.asObservable();

  private currentDateSubject = new BehaviorSubject<Date>(new Date());
  currentDate$ = this.currentDateSubject.asObservable();

  constructor() { // TODO: Implement }

  setView(view: CalendarView) {
    this.currentViewSubject.next(view);
  }

  setCurrentDate(date: Date) {
    this.currentDateSubject.next(date);
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  getWeekDays(startDate: Date): Date[] {
    const days: Date[] = [];
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }

  getMonthDays(year: number, month: number): Date[] {
    const days: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Preenche dias do mês anterior
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(date);
    }

    // Preenche dias do mês atual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push(date);
    }

    // Preenche dias do próximo mês
    const lastDayOfWeek = lastDay.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const date = new Date(year, month + 1, i);
      days.push(date);
    }

    return days;
  }

  getDaysBetween(startDate: Date, endDate: Date): Date[] {
    const days: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  getStartOfWeek(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();
    if (day !== 0) {
      result.setDate(result.getDate() - day);
    }
    return result;
  }

  getEndOfWeek(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();
    if (day !== 6) {
      result.setDate(result.getDate() + (6 - day));
    }
    return result;
  }

  getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  getEndOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
}
