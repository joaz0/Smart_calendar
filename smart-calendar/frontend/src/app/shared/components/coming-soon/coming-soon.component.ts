import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="coming-soon">
      <div class="coming-soon__card">
        <p class="coming-soon__eyebrow">Em desenvolvimento</p>
        <h1 class="coming-soon__title">{{ featureName }}</h1>
        <p class="coming-soon__text">
          Esta area esta em construcao. A navegacao ja esta funcionando para
          validar o fluxo pos-login.
        </p>
        <a class="coming-soon__action" routerLink="/app/dashboard">
          Voltar ao Dashboard
        </a>
      </div>
    </section>
  `,
  styleUrls: ['./coming-soon.component.scss'],
})
export class ComingSoonComponent {
  private route = inject(ActivatedRoute);
  featureName = 'Recurso';

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const raw = params.get('feature') || this.route.snapshot.queryParamMap.get('feature');
      this.featureName = raw ? this.formatFeature(raw) : 'Recurso';
    });
  }

  private formatFeature(value: string): string {
    const decoded = decodeURIComponent(value);
    return decoded
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
