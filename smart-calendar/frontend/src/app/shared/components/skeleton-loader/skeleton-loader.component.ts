import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [],
  template: `
    <div class="skeleton" [style.width]="width" [style.height]="height" [class.circle]="circle"></div>
  `,
  styles: [`
    .skeleton {
      background: var(--skeleton-gradient);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
    }

    .skeleton.circle {
      border-radius: 50%;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (prefers-color-scheme: dark) {
      .skeleton {
        background: var(--skeleton-gradient);
        background-size: 200% 100%;
      }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() width = '100%';
  @Input() height = '20px';
  @Input() circle = false;
}
