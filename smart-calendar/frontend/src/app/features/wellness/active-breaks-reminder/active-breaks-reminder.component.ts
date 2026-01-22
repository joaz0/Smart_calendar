import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface BreakRecord {
  time: string;
  completed: boolean;
}

@Component({
  standalone: true,
  selector: 'app-active-breaks-reminder',
  imports: [FormsModule],
  templateUrl: './active-breaks-reminder.component.html',
  styleUrl: './active-breaks-reminder.component.scss'
})
export class ActiveBreaksReminderComponent {
  settings = { interval: 60, duration: 5, autoSchedule: true };
  nextBreakTime = '00:00';
  todayBreaks: BreakRecord[] = [];

  saveSettings(): void { 
    console.log('Save break settings');
  }
  skipBreak(): void { 
    console.log('Skip break');
  }
}
