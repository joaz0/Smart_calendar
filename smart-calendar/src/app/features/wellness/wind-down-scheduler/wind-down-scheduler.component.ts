import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms.component';

interface Category {
  id: string;
  name: string;
}

interface Violation {
  id: string;
  title: string;
  time: string;
}

@Component({
  standalone: true,
  selector: 'app-wind-down-scheduler',
  imports: [FormsModule],
  templateUrl: './wind-down-scheduler.html',
  styleUrl: './wind-down-scheduler.scss'
})
export class WindDownSchedulerComponent {
  settings = { sleepTime: '22:00', windDownDuration: 60 };
  categories: Category[] = [];
  violations: Violation[] = [];

  isBlocked(id: string): boolean { 
    console.log('Check blocked:', id);
    return false; 
  }
  toggleCategory(id: string): void {
    console.log('Toggle category:', id);
  }
  save(): void { 
    console.log('Save settings');
  }
  reschedule(id: string): void {
    console.log('Reschedule violation:', id);
  }
}
