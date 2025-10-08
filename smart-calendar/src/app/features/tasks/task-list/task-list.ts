import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItem } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItem],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  // Lista de tarefas; preenchida por um service em runtime
  tasks: any[] = [];
  filterText: string = '';

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
