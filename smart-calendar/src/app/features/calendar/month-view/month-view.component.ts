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
  weeks: Date[][] = [];
  calendarWeeks: Date[][] = [];
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
    const firstDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );

    // Ajusta para começar no domingo
    const firstDayOfCalendar = new Date(firstDayOfMonth);
    firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfMonth.getDay());

    // Gera as semanas
    this.weeks = [];
    let currentWeek: Date[] = [];

    for (
      let day = new Date(firstDayOfCalendar);
      day <= lastDayOfMonth || currentWeek.length > 0;

    ) {
      if (currentWeek.length === 7) {
        this.weeks.push(currentWeek);
        currentWeek = [];
      }

      currentWeek.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }

    // Completa a última semana se necessário
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        const nextDay = new Date(currentWeek[currentWeek.length - 1]);
        nextDay.setDate(nextDay.getDate() + 1);
        currentWeek.push(nextDay);
      }
      this.weeks.push(currentWeek);
    }
  }

  loadEvents() {
    const startDate = this.weeks[0][0];
    const endDate = this.weeks[this.weeks.length - 1][6];

    this.eventService
      .getEventsByDateRange(startDate, endDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (events) => (this.events = events),
        error: (error) => console.error('Erro ao carregar eventos:', error),
      });
  }

  loadTasks() {
    const startDate = this.weeks[0][0];
    const endDate = this.weeks[this.weeks.length - 1][6];

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

  trackByWeek(index: number): number {
    return index;
  }

  trackByDay(index: number, day: Date): number {
    return day.getTime();
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

  getDayIndicators(date: Date): string[] {
    return [];
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

  showMoreEvents(_day: Date, event?: Event) {
    if (event) event.stopPropagation();
    this.showAllDayItems(_day);
  }

  showMoreTasks(date: Date) {
    this.showAllDayItems(date);
  }
}
