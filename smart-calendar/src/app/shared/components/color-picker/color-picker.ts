import { Component, EventEmitter, Input, Output, forwardRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDividerModule, MatFormFieldModule, MatInputModule],
  templateUrl: './color-picker.html',
  styleUrls: ['./color-picker.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ]
})
export class ColorPickerComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() selectedColor: string = '#FFFFFF';
  @Input() disabled: boolean = false;
  @Input() allowCustom: boolean = true;
  @Output() colorSelected = new EventEmitter<string>();

  isPickerOpen = false;
  customColor: string = '';
  recentColors: string[] = [];

  // Paletas de cores organizadas por categoria
  colors = [
    { name: 'Azul', value: '#2196F3' },
    { name: 'Verde', value: '#4CAF50' },
    { name: 'Vermelho', value: '#F44336' },
    { name: 'Laranja', value: '#FF9800' },
    { name: 'Roxo', value: '#9C27B0' },
    { name: 'Rosa', value: '#E91E63' },
    { name: 'Ciano', value: '#00BCD4' },
    { name: 'Amarelo', value: '#FFEB3B' }
  ];

  readonly primaryColors: string[] = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548'
  ];

  readonly categoryColors: string[] = [
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#F44336'
  ];

  // ControlValueAccessor methods
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private isDisabled: boolean = false;

  // Elemento raiz do componente para evitar memory leaks
  private elementRef?: HTMLElement;

  ngOnInit(): void {
    // Garantir que a cor selecionada tenha o formato correto
    if (this.selectedColor && !this.selectedColor.startsWith('#')) {
      this.selectedColor = '#' + this.selectedColor;
    }
  }

  ngOnDestroy(): void {
    // Fechar picker ao destruir o componente
    this.closePicker();
  }

  // Fechar picker ao clicar fora - melhorado
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isPickerOpen) return;

    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.color-picker-container');
    
    if (!clickedInside) {
      this.closePicker();
    }
  }
  
  // Fechar picker ao pressionar ESC - simplificado
  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    if (this.isPickerOpen) {
      this.closePicker();
    }    
  }

  togglePicker(event: Event): void {
    if (this.disabled || this.isDisabled) return;

    event.stopPropagation();
    this.isPickerOpen = !this.isPickerOpen;
    
    if (this.isPickerOpen) {
      this.onTouched();
    }
  }

  closePicker(): void {
    this.isPickerOpen = false;
  }

  selectColor(color: string, event?: Event): void {
    if (this.disabled || this.isDisabled) return;

    if (event) {
      event.stopPropagation();
    }
    
    // Normalizar formato da cor
    const normalizedColor = this.normalizeColor(color);
    
    if (this.isValidColor(normalizedColor)) {
      this.selectedColor = normalizedColor;
      this.onChange(this.selectedColor);
      this.onTouched();
      this.colorSelected.emit(this.selectedColor);
      this.closePicker();
    }
  }

  onCustomColorChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const color = inputElement.value;
    
    if (this.isValidColor(color)) {
      this.selectColor(color, event);
    }
  }

  onColorTextChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let color = inputElement.value.trim();
    
    // Adicionar # se não tiver
    if (color && !color.startsWith('#')) {
      color = '#' + color;
    }
    
    if (this.isValidColor(color)) {
      this.selectColor(color, event);
    }
  }

  // Validação robusta de cor hexadecimal
  private isValidColor(color: string): boolean {
    if (!color) return false;
    
    // Suporta formatos: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
    const hexColorRegex = /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
    return hexColorRegex.test(color);
  }

  // Normaliza cor para formato consistente
  private normalizeColor(color: string): string {
    if (!color.startsWith('#')) {
      color = '#' + color;
    }
    return color.toUpperCase();
  }

  // ControlValueAccessor Implementation
  writeValue(value: string): void {
    if (value && this.isValidColor(value)) {
      this.selectedColor = this.normalizeColor(value);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.closePicker();
    }
  }

  trackByColor(index: number, color: any): string {
    return color.value;
  }

  trackByRecentColor(index: number, color: string): string {
    return color;
  }
}