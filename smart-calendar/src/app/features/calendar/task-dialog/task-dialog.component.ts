import { Component, inject } from '@angular/core.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms.component';
import { Task } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';

import { MatFormFieldModule } from '@angular/material/form-field.component';
import { MatInputModule } from '@angular/material/input.component';
import { MatDatepickerModule } from '@angular/material/datepicker.component';
import { MatSelectModule } from '@angular/material/select.component';
import { MatCheckboxModule } from '@angular/material/checkbox.component';
import { MatButtonModule } from '@angular/material/button.component';
import { MatIconModule } from '@angular/material/icon.component';
import { MatDialogModule } from '@angular/material/dialog.component';
import { MatNativeDateModule } from '@angular/material/core.component';

interface DialogData {
  task?: Task;
  date: Date;
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
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
    MatDialogModule
],
  templateUrl: './task-dialog.html',
  styleUrls: ['./task-dialog.scss'],
})
export class TaskDialogComponent {
  private dialogRef = inject<MatDialogRef<TaskDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  taskForm: FormGroup;
  isEditing: boolean;

  constructor() {
    const data = this.data;

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
