import { environment } from '../../../environments/environment';

export class Logger {
  readonly isDev = !environment.production;
  private context: string;

  constructor(context = 'App') {
    this.context = context;
  }

  info(message: string, data: unknown = ''): void {
    if (this.isDev) {
      console.log(`[INFO][${this.context}] ${message}`, data);
    }
  }

  warn(message: string, data: unknown = ''): void {
    console.warn(`[WARN][${this.context}] ${message}`, data);
  }

  error(message: string, data: unknown = ''): void {
    console.error(`[ERROR][${this.context}] ${message}`, data);
  }

  debug(message: string, data: unknown = ''): void {
    if (this.isDev) {
      console.debug(`[DEBUG][${this.context}] ${message}`, data);
    }
  }

  static info(message: string, ...data: unknown[]): void {
    logger.info(message, data.length ? data[0] : '');
  }

  static warn(message: string, ...data: unknown[]): void {
    logger.warn(message, data.length ? data[0] : '');
  }

  static error(message: string, ...data: unknown[]): void {
    logger.error(message, data.length ? data[0] : '');
  }

  static debug(message: string, ...data: unknown[]): void {
    logger.debug(message, data.length ? data[0] : '');
  }
}

export const logger = new Logger();
