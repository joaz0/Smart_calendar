import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { handleError, createErrors } from '../utils/error-handler';
import { logger } from '../utils/logger';

export const validationErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Erro de validação', { errors: errors.array() });
    return res.status(400).json({
      success: false,
      error: 'Erro de validação',
      details: errors.array(),
    });
  }
  next();
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const context = {
    method: req.method,
    path: req.path,
    ip: req.ip,
  };
  handleError(err, res, context);
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
