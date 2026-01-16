import { Component } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule
],
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.scss']
})
export class TaskForm {
  taskForm: FormGroup;
  isEditMode = false;
  isSaving = false;
  categories: any[] = [];
  tags: string[] = [];
  subtasks: any[] = [];
  hasReminder = false;
  reminderTime = 15;
  isRecurring = false;
  recurrencePattern = 'daily';
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: [''],
      description: [''],
      priority: ['medium'],
      categoryId: [''],
      dueDate: [''],
      dueTime: [''],
      estimatedDuration: [60]
    });
  }

  close(): void {
    console.log('Fechar formulário');
  }

  saveTask(): void {
    console.log('Salvar tarefa');
  }

  deleteTask(): void {
    console.log('Excluir tarefa');
  }

  addTag(event: any): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  addSubtask(): void {
    this.subtasks.push({ title: '', completed: false });
  }

  removeSubtask(index: number): void {
    this.subtasks.splice(index, 1);
  }
}