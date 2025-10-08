import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.html',
  standalone: true,
  imports: [CommonModule]
})
export class LoadingSpinner {
  @Input() overlay: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() message?: string;
  @Input() progress?: number;
}