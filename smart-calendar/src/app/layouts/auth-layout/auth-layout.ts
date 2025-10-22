// src/app/layouts/auth-layout/auth-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './auth-layout.html',
  styleUrls: ['./auth-layout.scss']
})
export class AuthLayout {
  isLoginMode = true;
  isForgotMode = false;
  authForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
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
        next: () => this.router.navigate(['/app/calendar']),
        error: (error) => {
          this.errorMessage = error.error?.message || 'Credenciais inválidas';
          this.isLoading = false;
        },
        complete: () => this.isLoading = false
      });
    } else {
      this.authService.register(formData).subscribe({
        next: () => this.router.navigate(['/app/calendar']),
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro no cadastro';
          this.isLoading = false;
        },
        complete: () => this.isLoading = false
      });
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.authForm.controls).forEach(key => {
      this.authForm.get(key)?.markAsTouched();
    });
  }

  toggleForgotMode() {
    this.isForgotMode = !this.isForgotMode;
    this.errorMessage = '';
    this.authForm.reset();
  }

  sendResetEmail() {
    const email = this.authForm.get('email')?.value;
    if (!email) {
      this.errorMessage = 'Digite seu e-mail';
      return;
    }
    
    this.isLoading = true;
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.errorMessage = '';
        alert('Link de redefinição enviado para seu e-mail!');
        this.toggleForgotMode();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erro ao enviar e-mail';
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.authForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['email']) return 'E-mail inválido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }

  loginWithGoogle() {
    this.isLoading = true;
    this.authService.loginWithGoogle().subscribe({
      next: () => this.router.navigate(['/app/calendar']),
      error: (error: any) => {
        this.errorMessage = 'Erro no login com Google';
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }

  loginWithMicrosoft() {
    this.isLoading = true;
    this.authService.loginWithMicrosoft().subscribe({
      next: () => this.router.navigate(['/app/calendar']),
      error: (error: any) => {
        this.errorMessage = 'Erro no login com Microsoft';
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }
}
