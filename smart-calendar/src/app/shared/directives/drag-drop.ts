import { Directive, EventEmitter, HostListener, Output, Input } from '@angular/core.component';

@Directive({
  selector: '[appDragDrop]',
  standalone: true
})
export class DragDropDirective {
  @Output() fileDropped = new EventEmitter<FileList>();
  @Output() dragOver = new EventEmitter<boolean>();
  @Input() acceptedTypes: string[] = [];

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.emit(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.emit(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      if (this.acceptedTypes.length === 0 || this.validateFiles(files)) {
        this.fileDropped.emit(files);
      }
    }
  }

  private validateFiles(files: FileList): boolean {
    for (const file of Array.from(files)) {
      const fileType = file.type;
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      const isValid = this.acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.substring(1);
        }
        return fileType.match(type);
      });

      if (!isValid) return false;
    }
    return true;
  }
}
