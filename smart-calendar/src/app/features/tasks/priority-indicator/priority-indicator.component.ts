import { Component, Input } from '@angular/core.component';

@Component({
  standalone: true,
  selector: 'app-priority-indicator',
  imports: [],
  templateUrl: './priority-indicator.html',
  styleUrl: './priority-indicator.scss'
})
export class PriorityIndicatorComponent {
  @Input() priority = 'medium';
  @Input() size = 'medium';
}
