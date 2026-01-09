import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    logger.info(`${req.method} ${req.path}`, {
      statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent')?.substring(0, 50),
    });

    return originalSend.call(this, data);
  };

  next();
};
