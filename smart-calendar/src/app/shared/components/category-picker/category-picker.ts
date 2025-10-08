import { Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface Category {
  id: string;
  name: string;
  color: string;
  count?: number;
}

@Component({
  selector: 'app-category-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-picker.html',
  styleUrls: ['./category-picker.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoryPicker),
      multi: true
    }
  ]
})
export class CategoryPicker implements ControlValueAccessor {
  // Estados do componente
  isOpen = false;
  showCategoryModal = false;
  
  // Categoria selecionada
  selectedCategory: Category | null = null;
  
  // Edição de categoria
  editingCategory: Category | null = null;
  categoryName = '';
  selectedColor = '#3b82f6';
  
  // Paleta de cores
  colorPalette = [
    '#3b82f6', '#10b981', '#ef4444', '#f59e0b',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
    '#6366f1', '#84cc16', '#f43f5e', '#06b6d4',
    '#a855f7', '#eab308', '#d946ef', '#22c55e'
  ];

  // Categorias padrão
  defaultCategories: Category[] = [
    { id: 'work', name: 'Trabalho', color: '#3b82f6', count: 0 },
    { id: 'personal', name: 'Pessoal', color: '#10b981', count: 0 },
    { id: 'health', name: 'Saúde', color: '#ef4444', count: 0 },
    { id: 'education', name: 'Educação', color: '#f59e0b', count: 0 }
  ];

  // Categorias personalizadas
  customCategories: Category[] = [
    { id: 'custom1', name: 'Projetos', color: '#8b5cf6', count: 0 }
  ];

  // ControlValueAccessor
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  disabled = false;

  writeValue(value: any): void {
    if (value) {
      // Procura a categoria pelo ID
      this.selectedCategory = 
        [...this.defaultCategories, ...this.customCategories]
          .find(cat => cat.id === value) || null;
    } else {
      this.selectedCategory = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Métodos do dropdown
  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.onTouched();
      }
    }
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.onChange(category.id);
    this.isOpen = false;
  }

  getCategoryCount(category: Category): number {
    return category.count || 0;
  }

  // Métodos de gerenciamento de categorias
  addNewCategory(): void {
    this.editingCategory = null;
    this.categoryName = '';
    this.selectedColor = this.colorPalette[0];
    this.showCategoryModal = true;
    this.isOpen = false;
  }

  editCategory(category: Category, event: Event): void {
    event.stopPropagation();
    this.editingCategory = category;
    this.categoryName = category.name;
    this.selectedColor = category.color;
    this.showCategoryModal = true;
    this.isOpen = false;
  }

  deleteCategory(category: Category, event: Event): void {
    event.stopPropagation();
    const index = this.customCategories.findIndex(c => c.id === category.id);
    if (index > -1) {
      this.customCategories.splice(index, 1);
      
      // Se a categoria deletada estava selecionada, limpa a seleção
      if (this.selectedCategory?.id === category.id) {
        this.selectedCategory = null;
        this.onChange(null);
      }
    }
  }

  // Métodos do modal
  selectColor(color: string): void {
    this.selectedColor = color;
  }

  saveCategory(): void {
    if (!this.categoryName.trim()) {
      return;
    }

    if (this.editingCategory) {
      // Editar categoria existente
      this.editingCategory.name = this.categoryName.trim();
      this.editingCategory.color = this.selectedColor;
    } else {
      // Criar nova categoria
      const newCategory: Category = {
        id: `custom-${Date.now()}`,
        name: this.categoryName.trim(),
        color: this.selectedColor,
        count: 0
      };
      this.customCategories.push(newCategory);
    }

    this.closeModal();
  }

  closeModal(): void {
    this.showCategoryModal = false;
    this.editingCategory = null;
    this.categoryName = '';
    this.selectedColor = this.colorPalette[0];
  }
}