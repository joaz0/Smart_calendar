import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-priority-indicator',
  imports: [],
  templateUrl: './priority-indicator.component.html',
  styleUrl: './priority-indicator.component.scss'
})
export class PriorityIndicatorComponent {
  @Input() priority = 'medium';
  @Input() size = 'medium';
}
