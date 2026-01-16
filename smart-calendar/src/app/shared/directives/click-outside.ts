import { Directive, ElementRef, Output, EventEmitter, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  private elementRef = inject(ElementRef);

  @Output() appClickOutside = new EventEmitter<Event>();

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.appClickOutside.emit(event);
    }
  }

  @HostListener('document:touchstart', ['$event'])
  onTouchStart(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.appClickOutside.emit(event);
    }
  }
}
