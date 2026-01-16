// Padrão de formulário reutilizável
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { BaseComponent } from '../../core/components/base.component';

export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'select'
    | 'textarea'
    | 'checkbox'
    | 'radio';
  placeholder?: string;
  value?: any;
  required?: boolean;
  validators?: any[];
  options?: { label: string; value: any }[];
  cols?: number;
  rows?: number;
  hint?: string;
  errorMessages?: Record<string, string>;
}

/**
 * Componente base para formulários
 * Fornece padrões para validação, submissão, feedback
 */
@Component({
  template: '',
})
export abstract class BaseFormComponent extends BaseComponent implements OnInit {
  form!: FormGroup;
  formFields: FormField[] = [];
  isSubmitting = false;
  serverError: string | null = null;

  constructor(protected formBuilder: FormBuilder) {
    super();
  }

  protected initialize(): void {
    this.buildForm();
  }

  /**
   * Constrói o formulário
   */
  buildForm(): void {
    const formConfig: Record<string, any> = {};

    this.formFields.forEach((field) => {
      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.validators) {
        validators.push(...field.validators);
      }

      formConfig[field.name] = [field.value || '', validators];
    });

    this.form = this.formBuilder.group(formConfig);
  }

  /**
   * Obtém controle do formulário
   */
  getControl(fieldName: string): AbstractControl | null {
    return this.form.get(fieldName);
  }

  /**
   * Verifica se campo tem erro
   */
  hasError(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Obtém mensagem de erro do campo
   */
  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    const field = this.formFields.find((f) => f.name === fieldName);

    if (!control || !control.errors) {
      return '';
    }

    // Tenta usar mensagem customizada
    if (field?.errorMessages) {
      for (const [errorType, message] of Object.entries(field.errorMessages)) {
        if (control.errors[errorType]) {
          return message;
        }
      }
    }

    // Usa mensagens padrão
    if (control.errors['required']) {
      return `${field?.label || fieldName} é obrigatório`;
    }
    if (control.errors['email']) {
      return 'Email inválido';
    }
    if (control.errors['minlength']) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }
    if (control.errors['maxlength']) {
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    }
    if (control.errors['pattern']) {
      return 'Formato inválido';
    }

    return 'Campo inválido';
  }

  /**
   * Reseta o formulário
   */
  resetForm(): void {
    this.form.reset();
    this.serverError = null;
  }

  /**
   * Submete o formulário
   */
  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.log('Formulário inválido');
      this.markFormGroupTouched(this.form);
      return;
    }

    try {
      this.isSubmitting = true;
      this.serverError = null;
      await this.handleSubmit(this.form.value);
    } catch (error: any) {
      this.serverError = error.message || 'Erro ao processar formulário';
      this.logError('Erro na submissão', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Método abstrato para tratar submissão
   */
  protected abstract handleSubmit(formValue: any): Promise<void>;

  /**
   * Marca todos os campos como touched para exibir erros
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Preenche o formulário com dados
   */
  populateForm(data: Record<string, any>): void {
    this.form.patchValue(data);
  }

  /**
   * Desabilita o formulário
   */
  disableForm(): void {
    this.form.disable();
  }

  /**
   * Habilita o formulário
   */
  enableForm(): void {
    this.form.enable();
  }
}
