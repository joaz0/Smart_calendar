import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: Record<string, any>
) => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500,
  details?: any
) => {
  return res.status(statusCode).json({
    success: false,
    error,
    ...(details && { details }),
  });
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  statusCode: number = 200
) => {
  return sendSuccess(res, data, statusCode, {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
};
