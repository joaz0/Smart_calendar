import { Component, Input } from '@angular/core';



@Component({
  selector: 'app-daily-ai-summary',
  standalone: true,
  imports: [],
  templateUrl: './daily-ai-summary.component.html',
  styleUrls: ['./daily-ai-summary.component.scss'],
})
export class DailyAiSummaryComponent {
  @Input() summary: unknown | null = null;
}
