Sanitização obrigatória:

import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string) {
  return this.sanitizer.bypassSecurityTrustHtml(html);
}

// Validação de entrada
sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
