import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

interface Category {
  id: string;
  name: string;
}

interface Subtask {
  title: string;
  completed: boolean;
}

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
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);

  taskForm: FormGroup;
  isEditMode = false;
  isSaving = false;
  categories: Category[] = [];
  tags: string[] = [];
  subtasks: Subtask[] = [];
  hasReminder = false;
  reminderTime = 15;
  isRecurring = false;
  recurrencePattern = 'daily';
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor() {
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

  addTag(event: MatChipInputEvent): void {
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