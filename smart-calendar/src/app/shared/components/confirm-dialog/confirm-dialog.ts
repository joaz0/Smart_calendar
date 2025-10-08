import { Component, EventEmitter, Input, Output, HostListener, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.scss']
})
export class ConfirmDialogComponent implements AfterViewChecked {
  @Input() visible: boolean = false;
  @Input() title: string = 'Confirmação';
  @Input() message: string = 'Tem certeza que deseja continuar?';
  @Input() details: string = ''; // Adicionado
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() showCancelButton: boolean = true;
  @Input() type: 'default' | 'destructive' = 'default';
  @Input() icon: string | null = null;
  @Input() iconType: 'emoji' | 'class' = 'emoji'; // Novo: tipo do ícone

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
}