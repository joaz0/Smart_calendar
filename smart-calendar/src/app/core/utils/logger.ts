/**
 * Logger simples para o frontend
 */
export class Logger {
  private isDev = !this.isProduction();

  private isProduction(): boolean {
    return process.env['NODE_ENV'] === 'production';
  }

  info(message: string, context?: Record<string, any>): void {
    if (this.isDev) {
      console.log(`[INFO] ${message}`, context || '');
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    console.warn(`[WARN] ${message}`, context || '');
  }

  error(message: string, context?: Record<string, any>): void {
    console.error(`[ERROR] ${message}`, context || '');
  }

  debug(message: string, context?: Record<string, any>): void {
    if (this.isDev) {
      console.debug(`[DEBUG] ${message}`, context || '');
    }
  }
}

export const logger = new Logger();
