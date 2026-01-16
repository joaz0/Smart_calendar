import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-wind-down-scheduler',
  imports: [FormsModule],
  templateUrl: './wind-down-scheduler.html',
  styleUrl: './wind-down-scheduler.scss'
})
export class WindDownScheduler {
  settings = { sleepTime: '22:00', windDownDuration: 60 };
  categories: unknown[] = [];
  violations: unknown[] = [];

  isBlocked(id: string) { return false; }
  toggleCategory(id: string) {}
  save() {}
  reschedule(id: string) {}
}
