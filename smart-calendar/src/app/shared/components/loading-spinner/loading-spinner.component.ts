import { Component, Input } from '@angular/core.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner.component';
import { MatProgressBarModule } from '@angular/material/progress-bar.component';
import { MatIconModule } from '@angular/material/icon.component';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatIconModule
],
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() message?: string;
  @Input() tip?: string;
  @Input() showText = true;
  @Input() showProgress = false;
  @Input() progress?: number;
  @Input() showDots = false;
  @Input() customIcon?: string;
  @Input() showIllustration = false;
  @Input() showLogo = false;

  get spinnerSize(): number {
    switch (this.size) {
      case 'small': return 24;
      case 'large': return 60;
      default: return 40;
    }
  }

  get strokeWidth(): number {
    switch (this.size) {
      case 'small': return 2;
      case 'large': return 4;
      default: return 3;
    }
  }
}