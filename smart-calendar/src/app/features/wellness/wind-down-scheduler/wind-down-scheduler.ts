import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  standalone: true,
  selector: 'app-wind-down-scheduler',
  imports: [FormsModule],
  templateUrl: './wind-down-scheduler.html',
  styleUrl: './wind-down-scheduler.scss'
})
export class WindDownSchedulerComponent {
  settings = { sleepTime: '22:00', windDownDuration: 60 };
  categories: any[] = [];
  violations: any[] = [];

  isBlocked(_id: string) { return false; }
  toggleCategory(_id: string) {}
  save() {}
  reschedule(_id: string) {}
}
