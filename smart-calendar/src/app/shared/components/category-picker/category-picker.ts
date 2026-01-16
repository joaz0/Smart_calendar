import { Component, forwardRef, HostListener, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, inject } from '@angular/core';

import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { Subject, takeUntil } from 'rxjs';

interface Category {
  id: string;
  name: string;
  color: string;
  count?: number;
  description?: string;
  icon?: string;
  isDefault?: boolean;
}

@Component({
  selector: 'app-category-picker',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatRippleModule
],
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
export class CategoryPicker implements ControlValueAccessor, OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);

  @ViewChild('categoryInput') categoryInput?: ElementRef<HTMLInputElement>;
  @ViewChild('dropdownContent') dropdownContent?: ElementRef<HTMLDivElement>;

  // Estados do componente
  isOpen = false;
  showCategoryModal = false;
  allowCreate = true;
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchTerm = '';

  // Categoria selecionada
  selectedCategory: Category | null = null;

  // Edição de categoria
  editingCategory: Category | null = null;
  categoryName = '';
  categoryDescription = '';
  selectedColor = '#3b82f6';
  selectedIcon = 'folder';

  // Validação
  nameError = '';
  isSaving = false;

  // Navegação por teclado
  highlightedIndex = -1;

  // Paleta de cores expandida
  colorPalette = [
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Azul Claro', value: '#06b6d4' },
    { name: 'Verde', value: '#10b981' },
    { name: 'Verde Lima', value: '#84cc16' },
    { name: 'Vermelho', value: '#ef4444' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Laranja', value: '#f97316' },
    { name: 'Amarelo', value: '#eab308' },
    { name: 'Roxo', value: '#8b5cf6' },
    { name: 'Violeta', value: '#a855f7' },
    { name: 'Índigo', value: '#6366f1' },
    { name: 'Ciano', value: '#14b8a6' },
    { name: 'Slate', value: '#64748b' },
    { name: 'Cinza', value: '#6b7280' },
    { name: 'Neutro', value: '#737373' },
    { name: 'Pedra', value: '#78716c' }
  ];

  // Ícones disponíveis
  availableIcons = [
    'folder', 'work', 'home', 'school', 'fitness_center',
    'restaurant', 'local_hospital', 'shopping_cart', 'flight',
    'sports_esports', 'book', 'music_note', 'palette', 'code',
    'camera_alt', 'favorite', 'star', 'lightbulb', 'rocket_launch'
  ];

  // Categorias padrão
  defaultCategories: Category[] = [
    {
      id: 'work',
      name: 'Trabalho',
      color: '#3b82f6',
      icon: 'work',
      count: 0,
      isDefault: true,
      description: 'Tarefas e eventos relacionados ao trabalho'
    },
    {
      id: 'personal',
      name: 'Pessoal',
      color: '#10b981',
      icon: 'home',
      count: 0,
      isDefault: true,
      description: 'Assuntos pessoais e familiares'
    },
    {
      id: 'health',
      name: 'Saúde',
      color: '#ef4444',
      icon: 'local_hospital',
      count: 0,
      isDefault: true,
      description: 'Consultas médicas e atividades de saúde'
    },
    {
      id: 'education',
      name: 'Educação',
      color: '#f59e0b',
      icon: 'school',
      count: 0,
      isDefault: true,
      description: 'Estudos, cursos e aprendizado'
    }
  ];

  // Categorias personalizadas
  customCategories: Category[] = [];

  // ControlValueAccessor
  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};
  disabled = false;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadCategories();
    this.loadCustomCategories();
    this.updateFilteredCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCategories(): void {
    this.categories = [...this.defaultCategories, ...this.customCategories];
  }

  private loadCustomCategories(): void {
    // Carregar categorias customizadas do localStorage
    const saved = localStorage.getItem('customCategories');
    if (saved) {
      try {
        this.customCategories = JSON.parse(saved);
        this.loadCategories();
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    }
  }

  private saveCustomCategories(): void {
    localStorage.setItem('customCategories', JSON.stringify(this.customCategories));
  }

  // ControlValueAccessor Implementation
  writeValue(value: unknown): void {
    if (value) {
      this.selectedCategory = this.categories.find(cat => cat.id === value) || null;
      this.cdr.markForCheck();
    } else {
      this.selectedCategory = null;
    }
  }

  registerOnChange(fn: unknown): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: unknown): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // Dropdown Methods
  toggleDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (this.disabled) return;

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.onTouched();
      this.updateFilteredCategories();
      this.highlightedIndex = -1;

      // Focar no input de busca se existir
      setTimeout(() => {
        if (this.categoryInput) {
          this.categoryInput.nativeElement.focus();
        }
      }, 100);
    } else {
      this.searchTerm = '';
      this.updateFilteredCategories();
    }

    this.cdr.markForCheck();
  }

  selectCategory(category: Category): void {
    if (this.disabled) return;

    this.selectedCategory = category;
    this.onChange(category.id);
    this.onTouched();
    this.isOpen = false;
    this.searchTerm = '';
    this.updateFilteredCategories();
    this.cdr.markForCheck();
  }

  onSearchInput(): void {
    this.updateFilteredCategories();
    this.highlightedIndex = -1;
    this.cdr.markForCheck();
  }

  private updateFilteredCategories(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = [...this.categories];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCategories = this.categories.filter(cat =>
        cat.name.toLowerCase().includes(term) ||
        cat.description?.toLowerCase().includes(term)
      );
    }
  }

  getCategoryCount(category: Category): number {
    return category.count || 0;
  }

  // Keyboard Navigation
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.isOpen && !this.showCategoryModal) return;

    if (this.isOpen) {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          this.closeDropdown();
          break;
        case 'ArrowDown':
          event.preventDefault();
          this.navigateDown();
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.navigateUp();
          break;
        case 'Enter':
          event.preventDefault();
          this.selectHighlighted();
          break;
      }
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeDropdown();
    }
  }

  private navigateDown(): void {
    if (this.highlightedIndex < this.filteredCategories.length - 1) {
      this.highlightedIndex++;
      this.scrollToHighlighted();
      this.cdr.markForCheck();
    }
  }

  private navigateUp(): void {
    if (this.highlightedIndex > 0) {
      this.highlightedIndex--;
      this.scrollToHighlighted();
      this.cdr.markForCheck();
    }
  }

  private selectHighlighted(): void {
    if (this.highlightedIndex >= 0 && this.highlightedIndex < this.filteredCategories.length) {
      this.selectCategory(this.filteredCategories[this.highlightedIndex]);
    }
  }

  private scrollToHighlighted(): void {
    setTimeout(() => {
      const highlighted = this.dropdownContent?.nativeElement.querySelector('.category-option.highlighted');
      if (highlighted) {
        highlighted.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.searchTerm = '';
    this.updateFilteredCategories();
    this.cdr.markForCheck();
  }

  // Category Management
  openCreateDialog(): void {
    this.addNewCategory();
  }

  addNewCategory(): void {
    this.editingCategory = null;
    this.categoryName = '';
    this.categoryDescription = '';
    this.selectedColor = this.colorPalette[0].value;
    this.selectedIcon = this.availableIcons[0];
    this.nameError = '';
    this.showCategoryModal = true;
    this.isOpen = false;
    this.cdr.markForCheck();

    // Prevenir scroll do body
    document.body.classList.add('modal-open');
  }

  editCategory(category: Category, event: Event): void {
    event.stopPropagation();

    if (category.isDefault) {
      // Não permitir edição de categorias padrão
      return;
    }

    this.editingCategory = category;
    this.categoryName = category.name;
    this.categoryDescription = category.description || '';
    this.selectedColor = category.color;
    this.selectedIcon = category.icon || 'folder';
    this.nameError = '';
    this.showCategoryModal = true;
    this.isOpen = false;
    this.cdr.markForCheck();

    document.body.classList.add('modal-open');
  }

  async deleteCategory(category: Category, event: Event): Promise<void> {
    event.stopPropagation();

    if (category.isDefault) {
      return;
    }

    const confirmed = await this.confirmDelete(category);
    if (!confirmed) return;

    const index = this.customCategories.findIndex(c => c.id === category.id);
    if (index > -1) {
      this.customCategories.splice(index, 1);
      this.saveCustomCategories();
      this.loadCategories();

      // Se a categoria deletada estava selecionada, limpa a seleção
      if (this.selectedCategory?.id === category.id) {
        this.selectedCategory = null;
        this.onChange(null);
      }

      this.updateFilteredCategories();
      this.cdr.markForCheck();
    }
  }

  private confirmDelete(category: Category): Promise<boolean> {
    return new Promise(resolve => {
      const message = category.count && category.count > 0
        ? `A categoria "${category.name}" possui ${category.count} itens. Deseja realmente excluí-la?`
        : `Deseja excluir a categoria "${category.name}"?`;

      resolve(confirm(message));
    });
  }

  // Modal Methods
  selectColor(color: string): void {
    this.selectedColor = color;
    this.cdr.markForCheck();
  }

  selectIcon(icon: string): void {
    this.selectedIcon = icon;
    this.cdr.markForCheck();
  }

  validateCategoryName(): boolean {
    this.nameError = '';

    if (!this.categoryName.trim()) {
      this.nameError = 'O nome da categoria é obrigatório';
      return false;
    }

    if (this.categoryName.trim().length < 2) {
      this.nameError = 'O nome deve ter pelo menos 2 caracteres';
      return false;
    }

    if (this.categoryName.trim().length > 30) {
      this.nameError = 'O nome deve ter no máximo 30 caracteres';
      return false;
    }

    // Verificar duplicatas
    const isDuplicate = this.categories.some(cat =>
      cat.name.toLowerCase() === this.categoryName.trim().toLowerCase() &&
      cat.id !== this.editingCategory?.id
    );

    if (isDuplicate) {
      this.nameError = 'Já existe uma categoria com este nome';
      return false;
    }

    return true;
  }

  async saveCategory(): Promise<void> {
    if (!this.validateCategoryName()) {
      this.cdr.markForCheck();
      return;
    }

    this.isSaving = true;
    this.cdr.markForCheck();

    // Simular delay de salvamento
    await new Promise(resolve => setTimeout(resolve, 300));

    if (this.editingCategory) {
      // Editar categoria existente
      this.editingCategory.name = this.categoryName.trim();
      this.editingCategory.description = this.categoryDescription.trim();
      this.editingCategory.color = this.selectedColor;
      this.editingCategory.icon = this.selectedIcon;
    } else {
      // Criar nova categoria
      const newCategory: Category = {
        id: `custom-${Date.now()}`,
        name: this.categoryName.trim(),
        description: this.categoryDescription.trim(),
        color: this.selectedColor,
        icon: this.selectedIcon,
        count: 0,
        isDefault: false
      };
      this.customCategories.push(newCategory);
    }

    this.saveCustomCategories();
    this.loadCategories();
    this.updateFilteredCategories();

    this.isSaving = false;
    this.closeModal();
  }

  closeModal(): void {
    this.showCategoryModal = false;
    this.editingCategory = null;
    this.categoryName = '';
    this.categoryDescription = '';
    this.selectedColor = this.colorPalette[0].value;
    this.selectedIcon = this.availableIcons[0];
    this.nameError = '';

    document.body.classList.remove('modal-open');
    this.cdr.markForCheck();
  }

  onModalOverlayClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('category-modal')) {
      this.closeModal();
    }
  }

  // TrackBy Functions
  trackByCategory(index: number, category: Category): string {
    return category.id;
  }

  trackByColor(index: number, color: unknown): string {
    return color.value;
  }

  trackByIcon(index: number, icon: string): string {
    return icon;
  }

  // Accessibility
  getCategoryAriaLabel(category: Category): string {
    let label = category.name;
    if (category.count && category.count > 0) {
      label += `, ${category.count} ${category.count === 1 ? 'item' : 'itens'}`;
    }
    if (category.description) {
      label += `, ${category.description}`;
    }
    return label;
  }

  getDropdownAriaLabel(): string {
    return this.isOpen ? 'Lista de categorias aberta' : 'Lista de categorias fechada';
  }
}
