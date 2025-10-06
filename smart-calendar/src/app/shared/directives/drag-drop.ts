import { Directive, ElementRef, HostListener, Output, EventEmitter, Input } from '@angular/core';

export interface DropData {
  type: string;
  data: any;
  source: any;
}

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  @Input() dragData: any;
  @Input() dragType: string = 'default';
  @Input() dropAllowed: string[] = ['default'];
  
  @Output() dragStart = new EventEmitter<DropData>();
  @Output() dragEnd = new EventEmitter<void>();
  @Output() dragOver = new EventEmitter<Event>();
  @Output() dragEnter = new EventEmitter<Event>();
  @Output() dragLeave = new EventEmitter<Event>();
  @Output() drop = new EventEmitter<DropData>();

  private isDragging = false;

  constructor(private el: ElementRef) {}

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    if (!event.dataTransfer) return;

    this.isDragging = true;
    event.dataTransfer.setData('application/json', JSON.stringify({
      type: this.dragType,
      data: this.dragData
    }));
    event.dataTransfer.effectAllowed = 'move';

    this.el.nativeElement.classList.add('dragging');
    this.dragStart.emit({
      type: this.dragType,
      data: this.dragData,
      source: this.el.nativeElement
    });
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    this.isDragging = false;
    this.el.nativeElement.classList.remove('dragging');
    this.dragEnd.emit();
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    if (!this.isValidDrop(event)) return;
    
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    this.el.nativeElement.classList.add('drag-over');
    this.dragOver.emit(event);
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    if (!this.isValidDrop(event)) return;
    
    event.preventDefault();
    this.el.nativeElement.classList.add('drag-over');
    this.dragEnter.emit(event);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    this.el.nativeElement.classList.remove('drag-over');
    this.dragLeave.emit(event);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.el.nativeElement.classList.remove('drag-over');

    try {
      const dropData = JSON.parse(event.dataTransfer!.getData('application/json'));
      
      if (this.dropAllowed.includes(dropData.type)) {
        this.drop.emit(dropData);
      }
    } catch (error) {
      console.error('Error parsing drop data:', error);
    }
  }

  private isValidDrop(event: DragEvent): boolean {
    if (!event.dataTransfer) return false;
    
    try {
      const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
      return this.dropAllowed.includes(dragData.type);
    } catch {
      return false;
    }
  }
}