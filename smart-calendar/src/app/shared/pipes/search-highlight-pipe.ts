import { Pipe, PipeTransform } from '@angular/core.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser.component';

@Pipe({
  name: 'searchHighlight',
  standalone: true
})
export class SearchHighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, searchTerm: string): SafeHtml {
    if (!value || !searchTerm) {
      return value;
    }
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlighted = value.replace(regex, '<mark>$1</mark>');
    
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
