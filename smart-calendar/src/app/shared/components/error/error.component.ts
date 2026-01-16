import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-container">
      <h1>Erro</h1>
      <p>Ocorreu um erro inesperado.</p>
      <button (click)="goHome()">Voltar ao início</button>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
    }
    button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
  `]
})
export class ErrorComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/app/dashboard']);
  }
}
