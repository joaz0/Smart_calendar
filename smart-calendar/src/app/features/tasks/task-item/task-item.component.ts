import { Component, Input, Output, EventEmitter } from '@angular/core.component';
import { FormsModule } from '@angular/forms.component';
import { MatCheckboxModule } from '@angular/material/checkbox.component';
import { MatIconModule } from '@angular/material/icon.component';
import { MatButtonModule } from '@angular/material/button.component';
import { MatMenuModule } from '@angular/material/menu.component';
import { MatChipsModule } from '@angular/material/chips.component';
import { MatProgressBarModule } from '@angular/material/progress-bar.component';
import { MatDividerModule } from '@angular/material/divider.component';
import { MatTooltipModule } from '@angular/material/tooltip.component';
import { PriorityIndicator } from '../priority-indicator/priority-indicator.component';

interface Subtask {
  title: string;
  completed: boolean;
}

interface Task {
  id?: string;
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: string;
  dueDate?: Date;
  category?: string;
  tags?: string[];
  subtasks?: Subtask[];
}

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTooltipModule,
    PriorityIndicator
  ],
  templateUrl: './task-item.html',
  styleUrls: ['./task-item.scss']
})
export class TaskItemComponent {
  @Input() task: Task = {};
  @Output() taskToggled = new EventEmitter<Task>();
  @Output() taskEdited = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<Task>();

  showDescription = false;

  get isOverdue(): boolean {
    if (!this.task.dueDate || this.task.completed) return false;
    return new Date(this.task.dueDate) < new Date();
  }

  onToggleComplete(): void {
    this.taskToggled.emit(this.task);
  }

  onTaskClick(): void {
    this.showDescription = !this.showDescription;
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.taskEdited.emit(this.task);
  }

  onDelete(): void {
    this.taskDeleted.emit(this.task);
  }

  onDuplicate(): void {
    console.log('Duplicar tarefa');
  }

  onSetReminder(): void {
    console.log('Definir lembrete');
  }

  onMoveToCategory(): void {
    console.log('Mover para categoria');
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }

  getCompletedSubtasks(): number {
    return this.task.subtasks?.filter((s: Subtask) => s.completed).length || 0;
  }

  getSubtaskProgress(): number {
    if (!this.task.subtasks?.length) return 0;
    return (this.getCompletedSubtasks() / this.task.subtasks.length) * 100;
  }
}