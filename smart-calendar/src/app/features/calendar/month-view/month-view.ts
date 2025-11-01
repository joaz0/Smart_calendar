import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { CalendarService } from '../../../core/services/calendar.service';
import { TaskService } from '../../../core/services/task.service';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
import { Task } from '../../../core/models/task.model';
import { EventDialogComponent } from '../event-dialog/event-dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog';
import { DayDetailsDialogComponent } from '../day-details-dialog/day-details-dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-month-view',
  standalone: true,
  imports: [CommonModule, DatePipe, MatIconModule, MatButtonModule, MatListModule],
  templateUrl: './month-view.html',
  styleUrls: ['./month-view.scss'],
})
export class MonthView implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  weeks: Date[][] = [];
  events: Event[] = [];
  tasks: Task[] = [];
  weekdays: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  private destroy$ = new Subject<void>();
  private readonly maxVisibleItems = 3;

  constructor(
    private calendarService: CalendarService,
    private taskService: TaskService,
    private eventService: EventService,
    private dialog: MatDialog
  ) {}

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
      .getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) =>
          (this.tasks = tasks.filter(
            (task) => task.dueDate && task.dueDate >= startDate && task.dueDate <= endDate
          )),
        error: (error) => console.error('Erro ao carregar tarefas:', error),
      });
  }

  getEventsForDay(date: Date): Event[] {
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

  openEventDialog(event?: Event, date?: Date) {
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
}
