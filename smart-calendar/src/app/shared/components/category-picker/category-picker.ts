import { Component, forwardRef, HostListener, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface Category {
  id: string;
  name: string;
  color: string;
  count?: number;
  isDefault?: boolean;
}

@Component({
  selector: 'app-category-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDividerModule],
  templateUrl: './category-picker.html',
  styleUrls: ['./category-picker.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoryPicker),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryPicker implements ControlValueAccessor {
  isOpen = false;
  showCategoryModal = false;
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  editingCategory: Category | null = null;
  categoryName = '';
  selectedColor = '#3b82f6';
  nameError = '';

  colorPalette = [
    '#3b82f6', '#10b981', '#ef4444', '#f59e0b',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
    '#6366f1', '#84cc16', '#06b6d4', '#eab308'
  ];

  defaultCategories: Category[] = [
    { id: 'work', name: 'Trabalho', color: '#3b82f6', count: 0, isDefault: true },
    { id: 'personal', name: 'Pessoal', color: '#10b981', count: 0, isDefault: true },
    { id: 'health', name: 'Saúde', color: '#ef4444', count: 0, isDefault: true },
    { id: 'education', name: 'Educação', color: '#f59e0b', count: 0, isDefault: true }
  ];

  customCategories: Category[] = [];

  private onChange = (value: any) => {};
  private onTouched = () => {};
  disabled = false;

  constructor(private cdr: ChangeDetectorRef, private elementRef: ElementRef) {
    this.loadCategories();
  }

  private loadCategories(): void {
    const saved = localStorage.getItem('customCategories');
    if (saved) {
      try {
        this.customCategories = JSON.parse(saved);
      } catch {}
    }
    this.categories = [...this.defaultCategories, ...this.customCategories];
  }

  private saveCategories(): void {
    localStorage.setItem('customCategories', JSON.stringify(this.customCategories));
  }

  writeValue(value: any): void {
    this.selectedCategory = value ? this.categories.find(cat => cat.id === value) || null : null;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.onTouched();
    this.cdr.markForCheck();
  }

  selectCategory(category: Category): void {
    if (this.disabled) return;
    this.selectedCategory = category;
    this.onChange(category.id);
    this.isOpen = false;
    this.cdr.markForCheck();
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isOpen) this.closeDropdown();
    if (this.showCategoryModal) this.closeModal();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.cdr.markForCheck();
  }

  openCreateDialog(): void {
    this.editingCategory = null;
    this.categoryName = '';
    this.selectedColor = this.colorPalette[0];
    this.nameError = '';
    this.showCategoryModal = true;
    this.isOpen = false;
    this.cdr.markForCheck();
  }

  editCategory(category: Category, event: Event): void {
    event.stopPropagation();
    if (category.isDefault) return;
    
    this.editingCategory = category;
    this.categoryName = category.name;
    this.selectedColor = category.color;
    this.nameError = '';
    this.showCategoryModal = true;
    this.isOpen = false;
    this.cdr.markForCheck();
  }

  deleteCategory(category: Category, event: Event): void {
    event.stopPropagation();
    if (category.isDefault || !confirm(`Deseja excluir "${category.name}"?`)) return;

    const index = this.customCategories.findIndex(c => c.id === category.id);
    if (index > -1) {
      this.customCategories.splice(index, 1);
      this.saveCategories();
      this.loadCategories();
      
      if (this.selectedCategory?.id === category.id) {
        this.selectedCategory = null;
        this.onChange(null);
      }
      this.cdr.markForCheck();
    }
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  private validateName(): boolean {
    const name = this.categoryName.trim();
    
    if (!name) {
      this.nameError = 'Nome obrigatório';
      return false;
    }
    if (name.length < 2 || name.length > 30) {
      this.nameError = 'Nome deve ter entre 2 e 30 caracteres';
      return false;
    }
    if (this.categories.some(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== this.editingCategory?.id)) {
      this.nameError = 'Nome já existe';
      return false;
    }
    return true;
  }

  saveCategory(): void {
    if (!this.validateName()) return;

    if (this.editingCategory) {
      this.editingCategory.name = this.categoryName.trim();
      this.editingCategory.color = this.selectedColor;
    } else {
      this.customCategories.push({
        id: `custom-${Date.now()}`,
        name: this.categoryName.trim(),
        color: this.selectedColor,
        count: 0,
        isDefault: false
      });
    }

    this.saveCategories();
    this.loadCategories();
    this.closeModal();
  }

  closeModal(): void {
    this.showCategoryModal = false;
    this.editingCategory = null;
    this.categoryName = '';
    this.selectedColor = this.colorPalette[0];
    this.nameError = '';
    this.cdr.markForCheck();
  }

  trackByCategory(_: number, category: Category): string {
    return category.id;
  }
}
