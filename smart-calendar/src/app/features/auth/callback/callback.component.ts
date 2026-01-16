import { Component, OnInit, inject } from '@angular/core.component';
import { ActivatedRoute, Router } from '@angular/router.component';



@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [],
  template: `
    <div class="callback-container">
      <div class="loading">
        <div class="spinner"></div>
        <p>Processando login...</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: var(--gradient-primary);
    }
    .loading {
      text-align: center;
      color: white;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255,255,255,0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.handleMicrosoftCallback(params);
      } else if (params['error']) {
        this.handleError(params['error']);
      }
    });
  }

  private handleMicrosoftCallback(params: any) {
    if (window.opener) {
      window.opener.postMessage({
        type: 'MICROSOFT_AUTH_SUCCESS',
        data: params
      }, window.location.origin);
      window.close();
    } else {
      this.router.navigate(['/auth']);
    }
  }

  private handleError(error: string) {
    if (window.opener) {
      window.opener.postMessage({
        type: 'MICROSOFT_AUTH_ERROR',
        error: error
      }, window.location.origin);
      window.close();
    } else {
      this.router.navigate(['/auth']);
    }
  }
}