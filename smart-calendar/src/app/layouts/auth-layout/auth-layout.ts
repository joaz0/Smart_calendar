// src/app/layouts/auth-layout/auth-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { OAuthService } from '../../core/services/oauth.service';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './auth-layout.html',
  styleUrls: ['./auth-layout.scss']
})
export class AuthLayout {
  isLoginMode = true;
  authForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private oauthService: OAuthService
  ) {
    this.authForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['']
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';

    // Resetar e ajustar validações do formulário
    this.authForm.reset();

    if (this.isLoginMode) {
      this.authForm.get('name')?.clearValidators();
    } else {
      this.authForm.get('name')?.setValidators([Validators.required]);
    }

    this.authForm.get('name')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = this.authForm.value;

    if (this.isLoginMode) {
      this.authService.login(formData.email, formData.password).subscribe({
        next: (user) => {
          console.log('Login successful:', user);
          this.router.navigate(['/calendar']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = error.error?.message || 'Credenciais inválidas';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.authService.register(formData).subscribe({
        next: (user) => {
          console.log('Registration successful:', user);
          this.router.navigate(['/calendar']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage = error.error?.message || 'Erro no cadastro';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.authForm.controls).forEach(key => {
      const control = this.authForm.get(key);
      control?.markAsTouched();
    });
  }

  async loginWithGoogle() {
    this.isLoading = true;
    try {
      const loginObservable = await this.oauthService.loginWithGoogle();
      loginObservable.subscribe({
        next: (response) => {
          console.log('Google login successful:', response);
          this.authService.loginWithOAuth('google', response).subscribe({
            next: (user) => {
              this.router.navigate(['/calendar']);
            },
            error: (error) => {
              console.error('Google OAuth error:', error);
              this.errorMessage = 'Erro no login com Google';
              this.isLoading = false;
            }
          });
        },
        error: (error) => {
          console.error('Google login error:', error);
          this.errorMessage = 'Erro no login com Google';
          this.isLoading = false;
        }
      });
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = 'Erro ao inicializar Google login';
    }
  }

  async loginWithMicrosoft() {
    this.isLoading = true;
    try {
      const loginObservable = await this.oauthService.loginWithMicrosoft();
      loginObservable.subscribe({
        next: (response) => {
          console.log('Microsoft login successful:', response);
          this.authService.loginWithOAuth('microsoft', response).subscribe({
            next: (user) => {
              this.router.navigate(['/calendar']);
            },
            error: (error) => {
              console.error('Microsoft OAuth error:', error);
              this.errorMessage = 'Erro no login com Microsoft';
              this.isLoading = false;
            }
          });
        },
        error: (error) => {
          console.error('Microsoft login error:', error);
          this.errorMessage = 'Erro no login com Microsoft';
          this.isLoading = false;
        }
      });
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = 'Erro ao inicializar Microsoft login';
    }
  }

  forgotPassword() {
    const email = prompt('Digite seu e-mail para redefinir a senha:');
    if (email) {
      alert(`Link de redefinição enviado para: ${email}`);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.authForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['email']) {
        return 'E-mail inválido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }

    return '';
  }
}
