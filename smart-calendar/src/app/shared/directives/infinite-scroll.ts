import { Directive, ElementRef, EventEmitter, Output, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective {
  private elementRef = inject(ElementRef);

  @Output() scrolled = new EventEmitter<void>();

  @HostListener('scroll')
  onScroll(): void {
    const element = this.elementRef.nativeElement;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

    if (atBottom) {
      this.scrolled.emit();
    }
  }
}
