import { Response } from 'express';
import { logger } from './logger';

export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export class ApiError extends Error {
  constructor(
    public type: ErrorType,
    public statusCode: number,
    message: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleError = (error: unknown, res: Response, context?: Record<string, any>) => {
  if (error instanceof ApiError) {
    logger.warn(error.message, { type: error.type, ...context });
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.type,
    });
  }

  if (error instanceof Error) {
    logger.error('Erro não tratado', { ...context, errorMessage: error.message }, error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      type: ErrorType.INTERNAL_ERROR,
    });
  }

  logger.error('Erro desconhecido', context);
  return res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    type: ErrorType.INTERNAL_ERROR,
  });
};

export const createErrors = {
  validationError: (message: string, context?: Record<string, any>) =>
    new ApiError(ErrorType.VALIDATION_ERROR, 400, message, context),

  authenticationError: (message: string = 'Não autenticado', context?: Record<string, any>) =>
    new ApiError(ErrorType.AUTHENTICATION_ERROR, 401, message, context),

  authorizationError: (message: string = 'Não autorizado', context?: Record<string, any>) =>
    new ApiError(ErrorType.AUTHORIZATION_ERROR, 403, message, context),

  notFoundError: (resource: string, context?: Record<string, any>) =>
    new ApiError(ErrorType.NOT_FOUND, 404, `${resource} não encontrado`, context),

  conflictError: (message: string, context?: Record<string, any>) =>
    new ApiError(ErrorType.CONFLICT, 409, message, context),

  serviceUnavailableError: (service: string, context?: Record<string, any>) =>
    new ApiError(ErrorType.SERVICE_UNAVAILABLE, 503, `${service} indisponível`, context),
};
