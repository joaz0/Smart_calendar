import { Component, EventEmitter, Input, Output, HostListener, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.scss']
})
export class ConfirmDialogComponent implements AfterViewChecked {
  @Input() visible: boolean = false;
  @Input() title: string = 'Confirmação';
  @Input() message: string = 'Tem certeza que deseja continuar?';
  @Input() details: string = '';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() showCancelButton: boolean = true;
  @Input() type: 'default' | 'destructive' | 'warning' | 'danger' = 'default';
  @Input() icon: string | null = null;
  @Input() iconType: 'emoji' | 'class' = 'emoji';
  @Input() additionalInfo: string[] = [];
  @Input() requireConfirmation: boolean = false;
  @Input() confirmationText: string = 'CONFIRMAR';
  @Input() checkboxOptions: Array<{label: string, checked: boolean, disabled: boolean}> = [];
  
  isProcessing = false;
  userConfirmation: string = '';
  showConfirmationError: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('confirmButton') confirmButton!: ElementRef<HTMLButtonElement>;
  private firstFocus = true;

  // Tecla ESC para cancelar
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event) {
    if (this.visible && event instanceof KeyboardEvent) {
      this.onCancel();
      event.preventDefault();
    }
  }
  
  // Tecla Enter para confirmar
  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: Event) {
    if (this.visible && event instanceof KeyboardEvent && !event.defaultPrevented) {
      // Não confirmar se o foco estiver no botão cancelar
      const activeElement = document.activeElement as HTMLElement;
      if (!activeElement?.classList.contains('btn-secondary')) {
        this.onConfirm();
        event.preventDefault();
      }
    }
  }
  ngAfterViewChecked(): void {
    // Focar no botão confirmar quando o dialog abrir
    if (this.visible && this.firstFocus && this.confirmButton) {
      setTimeout(() => {
        this.confirmButton.nativeElement.focus();
        this.firstFocus = false;
      }, 100);
    }
    
    // Resetar firstFocus quando dialog fechar
    if (!this.visible) {
      this.firstFocus = true;
    }
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  // Prevenir fechamento ao clicar no conteúdo
  onContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
  
  getConfirmIcon(): string {
    if (this.icon) return this.icon;
    return this.type === 'destructive' ? 'warning' : 'check_circle';
  }

  getIcon(): string {
    return this.getConfirmIcon();
  }

  getConfirmButtonColor(): string {
    return this.type === 'destructive' ? 'warn' : 'primary';
  }

  canConfirm(): boolean {
    if (this.requireConfirmation) {
      return this.userConfirmation === this.confirmationText;
    }
    return true;
  }

  onConfirmationInput(): void {
    this.showConfirmationError = false;
  }

  trackByOption(index: number, option: any): number {
    return index;
  }
}