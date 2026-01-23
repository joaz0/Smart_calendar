import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent, FormField } from '../../../core/components/base-form.component';
import { CategoryService } from '../services/category.service';
import { CATEGORY_FORM_OPTIONS } from '../../../shared/tokens/color-tokens';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent extends BaseFormComponent {
  private categoryService = inject(CategoryService);

  constructor() {
    const fb = inject(FormBuilder);

    super(fb);
  }

  protected initialize(): void {
    this.formFields = [
      {
        name: 'name',
        label: 'Nome da Categoria',
        type: 'text',
        required: true,
        placeholder: 'Ex: Trabalho, Pessoal, Saúde',
        validators: [Validators.required, Validators.minLength(3)],
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
        options: CATEGORY_FORM_OPTIONS,
      },
    ];

    this.buildForm();
  }

  protected async handleSubmit(value: any): Promise<void> {
    await this.categoryService.create(value).toPromise();
    this.resetForm();
  }
}
