import { Component, EventEmitter, Output } from '@angular/core';

import { TaskItem } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItem],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  // Lista de tarefas; preenchida por um service em runtime
  tasks: unknown[] = [];
  filterText = '';

  @Output() create = new EventEmitter<void>();

  openNewTask(): void {
    this.create.emit();
  }

  applyFilter(): void {
    // stub: o serviço deve filtrar tasks conforme filterText
  }

  editTask(task: unknown): void {
    // stub
  }

  deleteTask(task: unknown): void {
    // stub
  }
}
