import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Event as CalendarEvent } from '../../../core/models/event.model';
import { Task } from '../../../core/models/task.model';
import { CommonModule, DatePipe } from '@angular/common.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


interface DialogData {
  date: Date;
  events: CalendarEvent[];
  tasks: Task[];
}

@Component({
  selector: 'app-day-details-dialog',
  standalone: true,
  imports: [CommonModule, DatePipe, MatListModule, MatIconModule, MatCheckboxModule, MatDialogModule, MatButtonModule],
  templateUrl: './day-details-dialog.html',
  styleUrls: ['./day-details-dialog.scss'],
})
export class DayDetailsDialogComponent {
  private dialogRef = inject<MatDialogRef<DayDetailsDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);


  close() {
    this.dialogRef.close();
  }

  getEventTime(evt: CalendarEvent): string {
    return evt.startDate
      ? new Date(evt.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
  }

  getTaskTime(task: Task): string {
    return task.dueDate
      ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
  }

  addEvent() {
    this.dialogRef.close({ action: 'addEvent', date: this.data.date });
  }

  addTask() {
    this.dialogRef.close({ action: 'addTask', date: this.data.date });
  }

  trackByEvent(index: number, event: CalendarEvent): any {
    return event.id || index;
  }

  trackByTask(index: number, task: Task): any {
    return task.id || index;
  }

  openEvent(evt: CalendarEvent) {
    this.dialogRef.close({ action: 'openEvent', event: evt });
  }

  openTask(task: Task) {
    this.dialogRef.close({ action: 'openTask', task });
  }

  isTaskOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && !task.completed;
  }

  toggleTaskCompletion(task: Task, event: any) {
    task.completed = event.checked;
    this.dialogRef.close({ action: 'toggleTask', task });
  }

  getCategoryColor(category: any): string {
    return category?.color || '#6366f1';
  }

  getCategoryName(category: any): string {
    return category?.name || 'Sem categoria';
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      pending: 'Pendente',
      'in-progress': 'Em andamento',
      completed: 'Concluída'
    };
    return labels[status] || status;
  }
}
