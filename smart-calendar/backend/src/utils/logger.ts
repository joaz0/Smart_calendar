// Logger utility para logging estruturado
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDev = process.env.NODE_ENV !== 'production';

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, error } = entry;
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    const errorStr = error ? ` | ${error.message}` : '';
    return `[${timestamp}] [${level}] ${message}${contextStr}${errorStr}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    };

    const formatted = this.formatLog(entry);

    switch (level) {
      case LogLevel.ERROR:
        console.error(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.INFO:
        console.log(formatted);
        break;
      case LogLevel.DEBUG:
        if (this.isDev) console.debug(formatted);
        break;
    }
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }
}

export const logger = new Logger();
