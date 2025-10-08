// src/app/layouts/auth-layout/auth-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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
    private router: Router
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

    // Simular chamada de API
    setTimeout(() => {
      this.isLoading = false;

      // Simular autenticação bem-sucedida
      if (this.authForm.value.email && this.authForm.value.password) {
        console.log(`${this.isLoginMode ? 'Login' : 'Registro'} bem-sucedido:`, this.authForm.value);
        this.router.navigate(['/']);
      } else {
        this.errorMessage = this.isLoginMode
          ? 'Credenciais inválidas. Tente novamente.'
          : 'Erro no cadastro. Tente novamente.';
      }
    }, 1500);
  }

  private markFormGroupTouched() {
    Object.keys(this.authForm.controls).forEach(key => {
      const control = this.authForm.get(key);
      control?.markAsTouched();
    });
  }

  loginWithGoogle() {
    this.isLoading = true;
    console.log('Login com Google...');

    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/']);
    }, 1500);
  }

  loginWithMicrosoft() {
    this.isLoading = true;
    console.log('Login com Microsoft...');

    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/']);
    }, 1500);
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
