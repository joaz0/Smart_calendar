import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Event } from '../../../core/models/event.model';
import { Task } from '../../../core/models/task.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

interface DialogData {
  date: Date;
  events: Event[];
  tasks: Task[];
}

@Component({
  selector: 'app-day-details-dialog',
  standalone: true,
  imports: [CommonModule, DatePipe, MatListModule, MatIconModule, MatCheckboxModule, MatDialogModule],
  templateUrl: './day-details-dialog.html',
  styleUrls: ['./day-details-dialog.scss'],
})
export class DayDetailsDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DayDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  close() {
    this.dialogRef.close();
  }

  getEventTime(event: Event): string {
    return event.startDate
      ? new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
  }

  getTaskTime(task: Task): string {
    return task.dueDate
      ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
  }
}
