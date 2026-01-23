import { Component, EventEmitter, Input, Output, forwardRef, HostListener, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, inject } from '@angular/core';

import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { ColorPalette, COLOR_NAME_MAP, COLOR_PICKER_PALETTES, DEFAULT_EVENT_COLOR } from '../../tokens/color-tokens';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatRippleModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule
],
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerComponentComponent implements ControlValueAccessor, OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);

  @ViewChild('customColorInput') customColorInput?: ElementRef<HTMLInputElement>;
  @ViewChild('paletteContainer') paletteContainer?: ElementRef<HTMLDivElement>;

  @Input() selectedColor = DEFAULT_EVENT_COLOR;
  @Input() disabled = false;
  @Input() allowCustom = true;
  @Input() allowTransparent = false;
  @Input() showRecentColors = true;
  @Input() maxRecentColors = 8;
  @Output() colorSelected = new EventEmitter<string>();
  @Output() colorChanged = new EventEmitter<string>();

  isPickerOpen = false;
  customColor = '';
  customColorText = '';
  recentColors: string[] = [];

  // Paletas de cores organizadas
  palettes: ColorPalette[] = COLOR_PICKER_PALETTES;

  // ControlValueAccessor
  private onChange: (value: string) => void = () => {
    // ControlValueAccessor callback
  };
  private onTouched: () => void = () => {
    // ControlValueAccessor callback
  };
  private isDisabled = false;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.normalizeColor();
    this.loadRecentColors();
    this.customColor = this.selectedColor;
    this.customColorText = this.selectedColor.toUpperCase();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.closePicker();
  }

  private normalizeColor(): void {
    if (this.selectedColor && !this.selectedColor.startsWith('#')) {
      this.selectedColor = '#' + this.selectedColor;
    }
    this.selectedColor = this.selectedColor.toUpperCase();
  }

  private loadRecentColors(): void {
    const saved = localStorage.getItem('recentColors');
    if (saved) {
      try {
        this.recentColors = JSON.parse(saved);
      } catch (error) {
        console.error('Erro ao carregar cores recentes:', error);
        this.recentColors = [];
      }
    }
  }

  private saveRecentColor(color: string): void {
    // Remover cor se já existir
    this.recentColors = this.recentColors.filter(c => c !== color);

    // Adicionar no início
    this.recentColors.unshift(color);

    // Limitar quantidade
    if (this.recentColors.length > this.maxRecentColors) {
      this.recentColors = this.recentColors.slice(0, this.maxRecentColors);
    }

    // Salvar no localStorage
    localStorage.setItem('recentColors', JSON.stringify(this.recentColors));
    this.cdr.markForCheck();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isPickerOpen) return;

    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.closePicker();
    }
  }

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
      this.customColor = this.selectedColor;
      this.customColorText = this.selectedColor.toUpperCase();
    }

    this.cdr.markForCheck();
  }

  closePicker(): void {
    this.isPickerOpen = false;
    this.cdr.markForCheck();
  }

  selectColor(color: string, event?: Event): void {
    if (this.disabled || this.isDisabled) return;

    if (event) {
      event.stopPropagation();
    }

    const normalizedColor = this.normalizeColorValue(color);

    if (this.isValidColor(normalizedColor)) {
      this.selectedColor = normalizedColor;
      this.customColor = normalizedColor;
      this.customColorText = normalizedColor.toUpperCase();

      this.onChange(this.selectedColor);
      this.onTouched();
      this.colorSelected.emit(this.selectedColor);
      this.colorChanged.emit(this.selectedColor);

      this.saveRecentColor(this.selectedColor);
      this.closePicker();
      this.cdr.markForCheck();
    }
  }

  onCustomColorChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const color = inputElement.value;
    this.customColor = color;
    this.customColorText = color.toUpperCase();

    if (this.isValidColor(color)) {
      this.selectColor(color, event);
    }

    this.cdr.markForCheck();
  }

  onColorTextChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let color = inputElement.value.trim().toUpperCase();

    // Adicionar # se não tiver
    if (color && !color.startsWith('#')) {
      color = '#' + color;
      this.customColorText = color;
    }

    this.customColor = color;

    if (this.isValidColor(color)) {
      this.selectedColor = color;
      this.onChange(this.selectedColor);
      this.colorChanged.emit(this.selectedColor);
      this.saveRecentColor(this.selectedColor);
    }

    this.cdr.markForCheck();
  }

  onColorTextInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value.toUpperCase();

    // Permitir apenas caracteres válidos
    value = value.replace(/[^#0-9A-F]/gi, '');

    // Garantir que # esteja no início
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }

    // Limitar tamanho
    if (value.length > 7) {
      value = value.substring(0, 7);
    }

    this.customColorText = value;
    inputElement.value = value;
  }

  selectTransparent(): void {
    if (!this.allowTransparent) return;
    this.selectColor('transparent');
  }

  clearRecentColors(): void {
    this.recentColors = [];
    localStorage.removeItem('recentColors');
    this.cdr.markForCheck();
  }

  // Validação robusta de cor
  private isValidColor(color: string): boolean {
    if (!color) return false;

    if (color === 'transparent') return this.allowTransparent;

    // Suporta #RGB e #RRGGBB
    const hexColorRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    return hexColorRegex.test(color);
  }

  // Normaliza cor para formato consistente
  private normalizeColorValue(color: string): string {
    if (!color || color === 'transparent') return color;

    if (!color.startsWith('#')) {
      color = '#' + color;
    }

    // Converter #RGB para #RRGGBB
    if (color.length === 4) {
      color = '#' +
        color[1] + color[1] +
        color[2] + color[2] +
        color[3] + color[3];
    }

    return color.toUpperCase();
  }

  // Verifica se a cor é clara ou escura
  isLightColor(color: string): boolean {
    if (!color || color === 'transparent') return true;

    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calcular luminância
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5;
  }

  // ControlValueAccessor Implementation
  writeValue(value: string): void {
    if (value && this.isValidColor(value)) {
      this.selectedColor = this.normalizeColorValue(value);
      this.customColor = this.selectedColor;
      this.customColorText = this.selectedColor.toUpperCase();
      this.cdr.markForCheck();
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
    this.cdr.markForCheck();
  }

  // TrackBy Functions
  trackByPalette(index: number, palette: ColorPalette): string {
    return palette.name;
  }

  trackByColor(index: number, color: string): string {
    return color;
  }

  // Accessibility
  getColorName(color: string): string {
    return COLOR_NAME_MAP[color] || color;
  }

  getColorAriaLabel(color: string): string {
    return `Selecionar cor ${this.getColorName(color)} (${color})`;
  }
}
