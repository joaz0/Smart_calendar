import { Logger, logger } from './logger.component';

describe('Logger', () => {
  let loggerInstance: Logger;
  let consoleLogSpy: jasmine.Spy;
  let consoleWarnSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;
  let consoleDebugSpy: jasmine.Spy;

  beforeEach(() => {
    loggerInstance = new Logger();
    consoleLogSpy = spyOn(console, 'log');
    consoleWarnSpy = spyOn(console, 'warn');
    consoleErrorSpy = spyOn(console, 'error');
    consoleDebugSpy = spyOn(console, 'debug');
  });

  it('should be created', () => {
    expect(loggerInstance).toBeTruthy();
  });

  it('should export singleton instance', () => {
    expect(logger).toBeTruthy();
    expect(logger).toBeInstanceOf(Logger);
  });

  describe('info()', () => {
    it('should log info message in development mode', () => {
      const message = 'Test info message';
      const data = { key: 'value' };

      loggerInstance.info(message, data);

      if (!loggerInstance['isDev']) {
        expect(consoleLogSpy).not.toHaveBeenCalled();
      } else {
        expect(consoleLogSpy).toHaveBeenCalledWith(`[INFO][App] ${message}`, data);
      }
    });

    it('should log info message without data', () => {
      const message = 'Test info message';

      loggerInstance.info(message);

      if (loggerInstance['isDev']) {
        expect(consoleLogSpy).toHaveBeenCalledWith(`[INFO][App] ${message}`, '');
      }
    });

    it('should log info message with custom context', () => {
      const customLogger = new Logger('TestComponent');
      const message = 'Test info message';

      customLogger.info(message);

      if (customLogger['isDev']) {
        expect(consoleLogSpy).toHaveBeenCalledWith(`[INFO][TestComponent] ${message}`, '');
      }
    });
  });

  describe('warn()', () => {
    it('should always log warning message', () => {
      const message = 'Test warning message';
      const data = { key: 'value' };

      loggerInstance.warn(message, data);

      expect(consoleWarnSpy).toHaveBeenCalledWith(`[WARN][App] ${message}`, data);
    });

    it('should log warning message without data', () => {
      const message = 'Test warning message';

      loggerInstance.warn(message);

      expect(consoleWarnSpy).toHaveBeenCalledWith(`[WARN][App] ${message}`, '');
    });
  });

  describe('error()', () => {
    it('should always log error message', () => {
      const message = 'Test error message';
      const data = { key: 'value' };

      loggerInstance.error(message, data);

      expect(consoleErrorSpy).toHaveBeenCalledWith(`[ERROR][App] ${message}`, data);
    });

    it('should log error message without data', () => {
      const message = 'Test error message';

      loggerInstance.error(message);

      expect(consoleErrorSpy).toHaveBeenCalledWith(`[ERROR][App] ${message}`, '');
    });
  });

  describe('debug()', () => {
    it('should log debug message in development mode', () => {
      const message = 'Test debug message';
      const data = { key: 'value' };

      loggerInstance.debug(message, data);

      if (!loggerInstance['isDev']) {
        expect(consoleDebugSpy).not.toHaveBeenCalled();
      } else {
        expect(consoleDebugSpy).toHaveBeenCalledWith(`[DEBUG][App] ${message}`, data);
      }
    });

    it('should log debug message without data', () => {
      const message = 'Test debug message';

      loggerInstance.debug(message);

      if (loggerInstance['isDev']) {
        expect(consoleDebugSpy).toHaveBeenCalledWith(`[DEBUG][App] ${message}`, '');
      }
    });
  });
});
