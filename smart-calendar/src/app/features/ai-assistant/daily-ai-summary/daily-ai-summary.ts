import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daily-ai-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-ai-summary.html',
  styleUrls: ['./daily-ai-summary.scss'],
})
export class DailyAiSummary {
  @Input() summary: any | null = null;
}
