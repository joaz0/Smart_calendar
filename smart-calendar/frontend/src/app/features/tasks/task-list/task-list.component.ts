import { Component, EventEmitter, Output } from '@angular/core';

import { TaskItem } from '../task-item/task-item.component';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItem],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  // Lista de tarefas; preenchida por um service em runtime
  tasks: any[] = [];
  filterText = '';

  @Output() create = new EventEmitter<void>();

  openNewTask(): void {
    this.create.emit();
  }

  applyFilter(): void {
    // stub: o serviço deve filtrar tasks conforme filterText
  }

  editTask(task: any): void {
    // stub
  }

  deleteTask(task: any): void {
    // stub
  }
}
