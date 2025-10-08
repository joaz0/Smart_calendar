import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-intelligent-task-scheduler',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './intelligent-task-scheduler.html',
  styleUrls: ['./intelligent-task-scheduler.scss'],
})
export class IntelligentTaskScheduler {
  @Input() suggestions: any[] = [];

  apply(s: any): void {
    console.log('apply intelligent suggestion', s);
  }
}
