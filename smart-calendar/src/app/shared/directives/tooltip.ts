import { Directive, ElementRef, Input, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  private elementRef = inject(ElementRef);

  @Input() appTooltip = '';
  
  private tooltipElement: HTMLElement | null = null;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.appTooltip || this.tooltipElement) return;

    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = 'tooltip';
    this.tooltipElement.textContent = this.appTooltip;
    this.tooltipElement.style.position = 'absolute';
    this.tooltipElement.style.background = 'rgba(0, 0, 0, 0.75)';
    this.tooltipElement.style.color = 'white';
    this.tooltipElement.style.padding = '8px';
    this.tooltipElement.style.borderRadius = '4px';
    this.tooltipElement.style.zIndex = '1000';
    this.tooltipElement.style.fontSize = '12px';

    document.body.appendChild(this.tooltipElement);
    this.positionTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.tooltipElement) {
      document.body.removeChild(this.tooltipElement);
      this.tooltipElement = null;
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.tooltipElement) {
      this.positionTooltip();
    }
  }

  private positionTooltip(): void {
    if (!this.tooltipElement) return;

    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    this.tooltipElement.style.top = `${rect.top - this.tooltipElement.offsetHeight - 10}px`;
    this.tooltipElement.style.left = `${rect.left + rect.width / 2 - this.tooltipElement.offsetWidth / 2}px`;
  }
}
