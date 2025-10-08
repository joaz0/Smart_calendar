import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';
import { passwordMatchValidator } from '../../../utils/validation-utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue],
      },
      { validators: passwordMatchValidator('password', 'confirmPassword') }
    );
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.loadingService.show();
    const { name, email, password } = this.registerForm.value;

    this.authService.register({ name, email, password }).subscribe({
      next: () => {
        this.notificationService.addNotification({
          title: 'Conta Criada',
          message: 'Seu cadastro foi realizado com sucesso!',
          type: 'success',
        });
        this.router.navigate(['/calendar']);
      },
      error: (error: any) => {
        console.error('Erro no registro:', error);
        this.notificationService.addNotification({
          title: 'Erro no Cadastro',
          message: error.error?.message || 'Ocorreu um erro ao criar sua conta. Tente novamente.',
          type: 'error',
        });
        this.loadingService.hide();
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }

  onLogin() {
    this.router.navigate(['/auth/login']);
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Senha é obrigatória';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Senha deve ter no mínimo 8 caracteres';
    }
    if (passwordControl?.hasError('pattern')) {
      return 'Senha deve conter letra maiúscula, minúscula, número e caractere especial';
    }
    return '';
  }
}
