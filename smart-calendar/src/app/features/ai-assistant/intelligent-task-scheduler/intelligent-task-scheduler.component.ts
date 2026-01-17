import { Component, Input } from '@angular/core';

import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-intelligent-task-scheduler',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './intelligent-task-scheduler.component.html',
  styleUrls: ['./intelligent-task-scheduler.component.scss'],
})
export class IntelligentTaskSchedulerComponent {
  @Input() suggestions: unknown[] = [];

  apply(s: unknown): void {
    console.log('apply intelligent suggestion', s);
  }
}
