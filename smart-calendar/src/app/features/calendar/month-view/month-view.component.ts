// Angular Core
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';

// Angular Common
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';

// Angular Material
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

// RxJS
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Services
import { CalendarService } from '../../../core/services/calendar.service';
import { TaskService } from '../../../core/services/task.service';
import { EventService } from '../../../core/services/event.service';

// Models
import { Event as CalendarEvent } from '../../../core/models/event.model';
import { Task } from '../../../core/models/task.model';

// Components
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { DayDetailsDialogComponent } from '../day-details-dialog/day-details-dialog.component';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-month-view',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    SlicePipe,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule
  ],
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthViewComponent implements OnInit, OnDestroy {
  private calendarService = inject(CalendarService);
  private taskService = inject(TaskService);
  private eventService = inject(EventService);
  private dialog = inject(MatDialog);

  @Input() events: CalendarEvent[] = [];
  @Input() selectedDate: Date = new Date();
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() eventClicked = new EventEmitter<CalendarEvent>();

  currentDate: Date = new Date();
  calendarWeeks: CalendarDay[][] = [];
  tasks: Task[] = [];
  weekdays: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  maxEventsPerDay = 3;
  showMiniNav = false;
  currentMonthName = '';
  private destroy$ = new Subject<void>();
  private readonly maxVisibleItems = 3;

  ngOnInit() {
    this.generateCalendarDays();
    this.loadEvents();
    this.loadTasks();
  }

  generateCalendarDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();

    const weeks: CalendarDay[][] = [];
    let currentWeek: CalendarDay[] = [];

    // Dias do mês anterior
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      currentWeek.push(this.createCalendarDay(date, false));
    }

    // Dias do mês atual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      currentWeek.push(this.createCalendarDay(date, true));

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Dias do próximo mês
    if (currentWeek.length > 0) {
      let nextMonthDay = 1;
      while (currentWeek.length < 7) {
        const date = new Date(year, month + 1, nextMonthDay);
        currentWeek.push(this.createCalendarDay(date, false));
        nextMonthDay++;
      }
      weeks.push(currentWeek);
    }

    this.calendarWeeks = weeks;
  }

  private createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    return {
      date,
      isCurrentMonth,
      isToday: this.isToday(date),
      isSelected: this.isSelectedDate(date),
      events: this.getEventsForDay(date)
    };
  }

  private isSelectedDate(date: Date): boolean {
    if (!this.selectedDate) return false;
    return this.calendarService.isSameDay(date, this.selectedDate);
  }

  loadEvents() {
    if (this.calendarWeeks.length === 0) return;

    const startDate = this.calendarWeeks[0][0].date;
    const endDate = this.calendarWeeks[this.calendarWeeks.length - 1][6].date;

    this.eventService
      .getEventsByDateRange(startDate, endDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (events) => {
          this.events = events;
          this.generateCalendarDays(); // Regenerar para atualizar eventos
        },
        error: (error) => console.error('Erro ao carregar eventos:', error),
      });
  }

  loadTasks() {
    if (this.calendarWeeks.length === 0) return;

    const startDate = this.calendarWeeks[0][0].date;
    const endDate = this.calendarWeeks[this.calendarWeeks.length - 1][6].date;

    this.taskService
      .getAllTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks: Task[]) =>
          (this.tasks = tasks.filter(
            (task: Task) => task.dueDate && task.dueDate >= startDate && task.dueDate <= endDate
          )),
        error: (error: unknown) => console.error('Erro ao carregar tarefas:', error),
      });
  }

  getEventsForDay(date: Date): CalendarEvent[] {
    return this.events.filter(
      (event) => event.startDate && this.calendarService.isSameDay(new Date(event.startDate), date)
    );
  }

  getTasksForDay(date: Date): Task[] {
    return this.tasks.filter(
      (task) => task.dueDate && this.calendarService.isSameDay(new Date(task.dueDate), date)
    );
  }

  isToday(date: Date): boolean {
    return this.calendarService.isSameDay(date, new Date());
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth();
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
    this.generateCalendarDays();
    this.loadEvents();
    this.loadTasks();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
    this.generateCalendarDays();
    this.loadEvents();
    this.loadTasks();
  }

  goToToday() {
    this.currentDate = new Date();
    this.generateCalendarDays();
    this.loadEvents();
    this.loadTasks();
  }

  openEventDialog(event?: CalendarEvent, date?: Date) {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '500px',
      data: {
        event: event,
        date: date || this.currentDate,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.loadEvents();
        }
      });
  }

  openTaskDialog(task?: Task, date?: Date) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: {
        task: task,
        date: date || this.currentDate,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.loadTasks();
        }
      });
  }

  toggleTaskComplete(taskId: string) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.taskService
        .updateTask(taskId, task)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (error) => console.error('Erro ao atualizar tarefa:', error),
        });
    }
  }

  hasMoreItems(date: Date): boolean {
    const totalItems = this.getEventsForDay(date).length + this.getTasksForDay(date).length;
    return totalItems > this.maxVisibleItems;
  }

  getRemainingItemsCount(date: Date): number {
    const totalItems = this.getEventsForDay(date).length + this.getTasksForDay(date).length;
    return totalItems - this.maxVisibleItems;
  }

  showAllDayItems(date: Date) {
    const events = this.getEventsForDay(date);
    const tasks = this.getTasksForDay(date);

    const dialogRef = this.dialog.open(DayDetailsDialogComponent, {
      width: '500px',
      data: {
        date: date,
        events: events,
        tasks: tasks,
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addEvent() {
    this.openEventDialog(undefined, this.currentDate);
  }

  trackByEvent(index: number, event: CalendarEvent): string {
    return event?.id || index.toString();
  }

  trackByTask(index: number, task: Task): string {
    return task.id || index.toString();
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  hasEvents(date: Date): boolean {
    return this.getEventsForDay(date).length > 0;
  }

  getDayAriaLabel(date: Date): string {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  selectDay(date: Date) {
    this.showAllDayItems(date);
  }

  selectDate(date: Date) {
    this.dateSelected.emit(date);
  }

  onEventClick(_event: CalendarEvent, mouseEvent: Event) {
    mouseEvent.stopPropagation();
    this.eventClicked.emit(_event);
  }

  createEventOnDate(date: Date, mouseEvent: Event) {
    mouseEvent.stopPropagation();
    this.openEventDialog(undefined, date);
  }

  getEventTooltip(evt: CalendarEvent): string {
    return evt.title || '';
  }

  getTaskTooltip(task: Task): string {
    return task.title || '';
  }

  openEvent(evt: CalendarEvent, mouseEvent: PointerEvent) {
    mouseEvent.stopPropagation();
    this.openEventDialog(evt);
  }

  openTask(task: Task, mouseEvent: PointerEvent) {
    mouseEvent.stopPropagation();
    this.openTaskDialog(task);
  }

  showMoreEvents(day: CalendarDay, event?: Event) {
    if (event) event.stopPropagation();
    this.showAllDayItems(day.date);
  }

  showMoreTasks(date: Date) {
    this.showAllDayItems(date);
  }
}
