import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-priority-indicator',
  imports: [],
  templateUrl: './priority-indicator.html',
  styleUrl: './priority-indicator.scss'
})
export class PriorityIndicator {
  @Input() priority: string = 'medium';
  @Input() size: string = 'medium';
}
