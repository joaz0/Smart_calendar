export class Logger {
  static log(message: string, ...data: unknown[]): void {
    console.log(`[LOG] ${message}`, ...data);
  }

  static info(message: string, ...data: unknown[]): void {
    console.info(`[INFO] ${message}`, ...data);
  }

  static warn(message: string, ...data: unknown[]): void {
    console.warn(`[WARN] ${message}`, ...data);
  }

  static error(message: string, ...data: unknown[]): void {
    console.error(`[ERROR] ${message}`, ...data);
  }
}
