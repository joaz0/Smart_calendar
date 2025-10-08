import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {
  loginForm: FormGroup;
  returnUrl: string = '/calendar';
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  ngOnInit() {
    // Recupera URL de retorno dos parâmetros da rota
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/calendar';

    // Verifica se há credenciais salvas
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true,
      });
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loadingService.show();
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        this.router.navigate([this.returnUrl]);
      },
      error: (error: any) => {
        console.error('Erro no login:', error);
        this.notificationService.addNotification({
          title: 'Erro no Login',
          message: 'Credenciais inválidas. Tente novamente.',
          type: 'error',
        });
        this.loadingService.hide();
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }

  onForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }

  onRegister() {
    this.router.navigate(['/auth/register']);
  }
}
