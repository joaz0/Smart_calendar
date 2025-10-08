import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Task } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';

interface DialogData {
  task?: Task;
  date: Date;
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './task-dialog.html',
  styleUrls: ['./task-dialog.scss'],
})
export class TaskDialogComponent {
  taskForm: FormGroup;
  isEditing: boolean;

  constructor(
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.isEditing = !!data.task;
    this.taskForm = this.fb.group({
      title: [data.task?.title || '', [Validators.required]],
      description: [data.task?.description || ''],
      dueDate: [data.task?.dueDate || data.date, [Validators.required]],
      priority: [data.task?.priority || 'medium'],
      category: [data.task?.category || null],
      completed: [data.task?.completed || false],
    });
  }

  // placeholder categories usadas no template
  categories = [] as any[];

  onSubmit() {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;

      if (this.isEditing && this.data.task?.id) {
        this.taskService.updateTask(this.data.task.id, taskData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('Erro ao atualizar tarefa:', error),
        });
      } else {
        this.taskService.createTask(taskData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('Erro ao criar tarefa:', error),
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onDelete() {
    if (this.isEditing && this.data.task?.id) {
      this.taskService.deleteTask(this.data.task.id).subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => console.error('Erro ao excluir tarefa:', error),
      });
    }
  }

  // Helpers para template
  getTimeFromDate(date?: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toTimeString().slice(0, 5);
  }

  updateDueTime(time: string) {
    const due = this.taskForm.get('dueDate')?.value
      ? new Date(this.taskForm.get('dueDate')?.value)
      : new Date();
    const [hours, minutes] = time.split(':').map((v: string) => parseInt(v, 10));
    due.setHours(hours || 0, minutes || 0);
    this.taskForm.get('dueDate')?.setValue(due);
  }
}
