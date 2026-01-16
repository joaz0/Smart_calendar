import { Component, Input } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-intelligent-task-scheduler',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './intelligent-task-scheduler.html',
  styleUrls: ['./intelligent-task-scheduler.scss'],
})
export class IntelligentTaskScheduler {
  @Input() suggestions: unknown[] = [];

  apply(s: unknown): void {
    console.log('apply intelligent suggestion', s);
  }
}
