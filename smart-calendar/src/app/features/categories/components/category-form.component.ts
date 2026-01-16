import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent, FormField } from '@core/components/base-form.component';
import { CategoryService } from '../services/category.service';
import * as CustomValidators from '@core/validators/custom.validators';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent extends BaseFormComponent {
  private categoryService = inject(CategoryService);

  constructor() {
    const fb = inject(FormBuilder);

    super(fb, 'CategoryFormComponent');
  }

  protected initialize(): void {
    this.formFields = [
      {
        name: 'name',
        label: 'Nome da Categoria',
        type: 'text',
        required: true,
        placeholder: 'Ex: Trabalho, Pessoal, Saúde',
        validators: [CustomValidators.required, CustomValidators.minLength(3)],
        errorMessages: {
          required: 'Nome é obrigatório',
          minlength: 'Mínimo 3 caracteres',
        },
      },
      {
        name: 'description',
        label: 'Descrição',
        type: 'textarea',
        rows: 3,
        placeholder: 'Descrição opcional',
      },
      {
        name: 'color',
        label: 'Cor',
        type: 'select',
        options: [
          { label: '🔴 Vermelho', value: '#ef4444' },
          { label: '🔵 Azul', value: '#3b82f6' },
          { label: '🟢 Verde', value: '#22c55e' },
          { label: '🟣 Roxo', value: '#a855f7' },
          { label: '🟡 Amarelo', value: '#f59e0b' },
        ],
      },
    ];

    this.buildForm();
  }

  protected async handleSubmit(value: any): Promise<void> {
    await this.categoryService.create(value).toPromise();
    this.resetForm();
  }
}
