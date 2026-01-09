// Validadores customizados para Reactive Forms
import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/**
 * Coleção de validadores customizados reutilizáveis
 */
export class CustomValidators {
  /**
   * Valida se é um email válido
   */
  static email: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(control.value) ? null : { email: true };
  };

  /**
   * Valida força da senha
   */
  static strongPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const isStrong = hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;

    return isStrong ? null : { weakPassword: true };
  };

  /**
   * Valida se dois campos combinam (ex: password e confirmPassword)
   */
  static matchFields(fieldName: string, fieldToMatch: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const field = group.get(fieldName);
      const fieldMatch = group.get(fieldToMatch);

      if (!field || !fieldMatch) return null;

      return field.value === fieldMatch.value ? null : { fieldsMismatch: true };
    };
  }

  /**
   * Valida se é uma URL válida
   */
  static url: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    try {
      new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  };

  /**
   * Valida CPF
   */
  static cpf: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const cpf = control.value.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return { invalidCpf: true };
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return { invalidCpf: true };
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) {
      return { invalidCpf: true };
    }

    return null;
  };

  /**
   * Valida data (deve ser no futuro)
   */
  static futureDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const date = new Date(control.value);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return date > now ? null : { pastDate: true };
  };

  /**
   * Valida data (deve ser no passado)
   */
  static pastDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const date = new Date(control.value);
    const now = new Date();

    return date < now ? null : { futureDate: true };
  };

  /**
   * Valida idade mínima
   */
  static minAge(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
    };
  }

  /**
   * Validador assíncrono para verificar disponibilidade
   */
  static asyncAvailable(
    checkFunction: (value: string) => Observable<boolean>,
    debounceTime: number = 500
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(debounceTime).pipe(
        switchMap(() => checkFunction(control.value)),
        map((isAvailable) => (isAvailable ? null : { notAvailable: true }))
      );
    };
  }
}
