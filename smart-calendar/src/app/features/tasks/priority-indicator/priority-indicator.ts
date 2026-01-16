import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-priority-indicator',
  imports: [],
  templateUrl: './priority-indicator.html',
  styleUrl: './priority-indicator.scss'
})
export class PriorityIndicator {
  @Input() priority = 'medium';
  @Input() size = 'medium';
}
