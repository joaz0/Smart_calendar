import { environment } from '../../../environments/environment';

/**
 * Logger simples para o frontend
 */
export class Logger {
  private isDev = !environment.production;
  private context: string;

  constructor(context = 'App') {
    this.context = context;
  }

  info(message: string, data?: Record<string, any>): void {
    if (this.isDev) {
      console.log(`[INFO][${this.context}] ${message}`, data || '');
    }
  }

  warn(message: string, data?: Record<string, any>): void {
    console.warn(`[WARN][${this.context}] ${message}`, data || '');
  }

  error(message: string, data?: Record<string, any>): void {
    console.error(`[ERROR][${this.context}] ${message}`, data || '');
  }

  debug(message: string, data?: Record<string, any>): void {
    if (this.isDev) {
      console.debug(`[DEBUG][${this.context}] ${message}`, data || '');
    }
  }
}

export const logger = new Logger();
