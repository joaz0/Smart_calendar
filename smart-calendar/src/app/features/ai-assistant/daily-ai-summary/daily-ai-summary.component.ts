import { Component, Input } from '@angular/core.component';



@Component({
  selector: 'app-daily-ai-summary',
  standalone: true,
  imports: [],
  templateUrl: './daily-ai-summary.html',
  styleUrls: ['./daily-ai-summary.scss'],
})
export class DailyAiSummary {
  @Input() summary: any | null = null;
}
