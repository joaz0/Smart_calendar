import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-active-breaks-reminder',
  imports: [FormsModule],
  templateUrl: './active-breaks-reminder.html',
  styleUrl: './active-breaks-reminder.scss'
})
export class ActiveBreaksReminder {
  settings = { interval: 60, duration: 5, autoSchedule: true };
  nextBreakTime = '00:00';
  todayBreaks: unknown[] = [];

  saveSettings() {}
  skipBreak() {}
}
