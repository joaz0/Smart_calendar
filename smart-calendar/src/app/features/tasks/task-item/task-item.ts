import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItem {
  @Input() task: any | null = null;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  toggleComplete(task: any): void {
    if (!task) return;
    task.completed = !task.completed;
  }
}
