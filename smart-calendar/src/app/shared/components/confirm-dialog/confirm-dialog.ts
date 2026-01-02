import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';

interface CheckboxOption {
  label: string;
  checked: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatRippleModule
  ],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dialogContainer') dialogContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('confirmButton') confirmButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('cancelButton') cancelButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('confirmationInput') confirmationInput?: ElementRef<HTMLInputElement>;

  // Configurações básicas
  @Input() visible: boolean = false;
  @Input() title: string = 'Confirmação';
  @Input() message: string = 'Tem certeza que deseja continuar?';
  @Input() details: string = '';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() showCancelButton: boolean = true;

  // Tipos e estilos
  @Input() type: 'default' | 'destructive' | 'warning' | 'danger' | 'success' | 'info' = 'default';
  @Input() icon: string | null = null;
  @Input() iconType: 'emoji' | 'material' = 'material';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  // Funcionalidades avançadas
  @Input() additionalInfo: string[] = [];
  @Input() requireConfirmation: boolean = false;
  @Input() confirmationText: string = 'CONFIRMAR';
  @Input() checkboxOptions: CheckboxOption[] = [];
  @Input() loading: boolean = false;
  @Input() showProgress: boolean = false;
  @Input() progress: number = 0;
  @Input() autoClose: boolean = true;
  @Input() autoCloseDelay: number = 0;
  @Input() preventBackdropClose: boolean = false;

  // Eventos
  @Output() confirm = new EventEmitter<{
    checkboxStates?: Record<string, boolean>;
    confirmationText?: string;
  }>();
  @Output() cancel = new EventEmitter<void>();
  @Output() beforeClose = new EventEmitter<void>();
  @Output() afterClose = new EventEmitter<void>();

  // Estados internos
  isProcessing = false;
  userConfirmation: string = '';
  showConfirmationError: boolean = false;
  countdown: number = 0;
  private countdownInterval?: number;
  private autoCloseTimeout?: number;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.visible) {
      this.onDialogOpen();
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.removeBodyClass();
  }

  private onDialogOpen(): void {
    // Adicionar classe ao body para prevenir scroll
    document.body.classList.add('dialog-open');

    // Focar no elemento apropriado
    setTimeout(() => {
      this.focusInitialElement();
    }, 100);

    // Iniciar countdown se necessário
    if (this.autoCloseDelay > 0) {
      this.startCountdown();
    }
  }

  private focusInitialElement(): void {
    if (this.requireConfirmation && this.confirmationInput) {
      this.confirmationInput.nativeElement.focus();
    } else if (this.confirmButton) {
      this.confirmButton.nativeElement.focus();
    }
  }

  private startCountdown(): void {
    this.countdown = this.autoCloseDelay;
    this.cdr.markForCheck();

    this.countdownInterval = window.setInterval(() => {
      this.countdown--;
      this.cdr.markForCheck();

      if (this.countdown <= 0) {
        this.clearTimers();
        if (this.autoClose) {
          this.onCancel();
        }
      }
    }, 1000);
  }

  private clearTimers(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
      this.autoCloseTimeout = undefined;
    }
  }

  private removeBodyClass(): void {
    document.body.classList.remove('dialog-open');
  }

  // Navegação por teclado
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.visible && !this.preventBackdropClose && !this.isProcessing) {
      this.onCancel();
      event.preventDefault();
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: KeyboardEvent): void {
    if (!this.visible || this.isProcessing) return;

    const activeElement = document.activeElement as HTMLElement;
    const isOnCancelButton = activeElement?.classList.contains('btn-secondary');
    const isOnTextarea = activeElement?.tagName === 'TEXTAREA';

    if (!isOnCancelButton && !isOnTextarea && this.canConfirm()) {
      this.onConfirm();
      event.preventDefault();
    }
  }

  @HostListener('document:keydown.tab', ['$event'])
  onTabKey(event: KeyboardEvent): void {
    if (!this.visible || !this.dialogContainer) return;

    const focusableElements = this.getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus();
        event.preventDefault();
      }
    }
  }

  private getFocusableElements(): HTMLElement[] {
    if (!this.dialogContainer) return [];

    const selector = 'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
    return Array.from(this.dialogContainer.nativeElement.querySelectorAll(selector));
  }

  // Ações principais
  async onConfirm(): Promise<void> {
    if (!this.canConfirm() || this.isProcessing) return;

    this.isProcessing = true;
    this.clearTimers();
    this.cdr.markForCheck();

    // Preparar dados para emitir
    const data: any = {};

    if (this.checkboxOptions.length > 0) {
      data.checkboxStates = this.checkboxOptions.reduce((acc, opt) => {
        acc[opt.label] = opt.checked;
        return acc;
      }, {} as Record<string, boolean>);
    }

    if (this.requireConfirmation) {
      data.confirmationText = this.userConfirmation;
    }

    // Emitir evento
    this.confirm.emit(data);

    // Aguardar um frame para animações
    await new Promise(resolve => setTimeout(resolve, 100));

    if (this.autoClose) {
      this.closeDialog();
    } else {
      this.isProcessing = false;
      this.cdr.markForCheck();
    }
  }

  onCancel(): void {
    if (this.isProcessing) return;

    this.cancel.emit();
    this.closeDialog();
  }

  private closeDialog(): void {
    this.beforeClose.emit();
    this.visible = false;
    this.isProcessing = false;
    this.clearTimers();
    this.removeBodyClass();
    this.resetState();
    this.cdr.markForCheck();

    setTimeout(() => {
      this.afterClose.emit();
    }, 300);
  }

  private resetState(): void {
    this.userConfirmation = '';
    this.showConfirmationError = false;
    this.countdown = 0;
  }

  // Clique no backdrop
  onBackdropClick(event: MouseEvent): void {
    if (this.preventBackdropClose || this.isProcessing) return;

    const target = event.target as HTMLElement;
    if (target.classList.contains('confirm-dialog')) {
      this.onCancel();
    }
  }

  onContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  // Validação
  canConfirm(): boolean {
    if (this.requireConfirmation) {
      return this.userConfirmation.trim() === this.confirmationText;
    }
    return true;
  }

  onConfirmationInput(): void {
    this.showConfirmationError = false;
    this.cdr.markForCheck();
  }

  validateConfirmation(): void {
    if (this.requireConfirmation && this.userConfirmation !== this.confirmationText) {
      this.showConfirmationError = true;
      this.cdr.markForCheck();
    }
  }

  // Getters para UI
  getDialogIcon(): string {
    if (this.icon) return this.icon;

    const iconMap: Record<string, string> = {
      default: 'info',
      destructive: 'warning',
      warning: 'error_outline',
      danger: 'dangerous',
      success: 'check_circle',
      info: 'info'
    };

    return iconMap[this.type] || 'help_outline';
  }

  getDialogIconEmoji(): string {
    if (this.icon) return this.icon;

    const emojiMap: Record<string, string> = {
      default: '❓',
      destructive: '⚠️',
      warning: '⚠️',
      danger: '🚨',
      success: '✅',
      info: 'ℹ️'
    };

    return emojiMap[this.type] || '❓';
  }

  getIconColor(): string {
    const colorMap: Record<string, string> = {
      default: '#6366f1',
      destructive: '#ef4444',
      warning: '#f59e0b',
      danger: '#dc2626',
      success: '#10b981',
      info: '#3b82f6'
    };

    return colorMap[this.type] || '#6366f1';
  }

  getConfirmButtonClass(): string {
    return this.type === 'destructive' || this.type === 'danger'
      ? 'btn-primary destructive'
      : 'btn-primary';
  }

  getCancelButtonText(): string {
    if (this.countdown > 0) {
      return `${this.cancelText} (${this.countdown}s)`;
    }
    return this.cancelText;
  }

  getConfirmButtonText(): string {
    if (this.isProcessing) {
      return 'Processando...';
    }
    return this.confirmText;
  }

  // TrackBy
  trackByIndex(index: number): number {
    return index;
  }

  trackByOption(index: number, option: CheckboxOption): string {
    return option.label;
  }

  // Helpers públicos para controle externo
  public open(): void {
    this.visible = true;
    this.onDialogOpen();
    this.cdr.markForCheck();
  }

  public close(): void {
    this.closeDialog();
  }

  public setLoading(loading: boolean): void {
    this.isProcessing = loading;
    this.cdr.markForCheck();
  }

  public setProgress(progress: number): void {
    this.progress = Math.min(100, Math.max(0, progress));
    this.cdr.markForCheck();
  }

  // Acessibilidade
  getDialogAriaLabel(): string {
    return `${this.title}. ${this.message}`;
  }

  getConfirmButtonAriaLabel(): string {
    const labels: string[] = [this.confirmText];

    if (this.type === 'destructive' || this.type === 'danger') {
      labels.push('Ação destrutiva');
    }

    if (!this.canConfirm()) {
      labels.push('Desabilitado');
    }

    return labels.join('. ');
  }
}
