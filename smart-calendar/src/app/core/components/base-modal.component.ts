// Base Modal Component
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from './base.component';

/**
 * Classe base para modais
 * Fornece padrões para dialogs com Angular Material
 */
@Component({
  template: '',
})
export abstract class BaseModalComponent<T = any> extends BaseComponent {
  constructor(
    public dialogRef: MatDialogRef<BaseModalComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: T,
    componentName: string = 'BaseModalComponent'
  ) {
    super(componentName);
  }

  /**
   * Fecha o modal com resultado
   */
  closeWithResult(result: T): void {
    this.dialogRef.close(result);
  }

  /**
   * Fecha o modal sem resultado
   */
  close(): void {
    this.dialogRef.close();
  }

  /**
   * Implementação padrão
   */
  protected initialize(): void {
    // Pode ser sobrescrito pelos filhos
  }
}
