import { Request, Response, NextFunction } from 'express';
import logger from '@config/logger';
import { AppException } from '@shared/exceptions/app.exception';

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // If the error is an instance of AppException, it has already been logged by the constructor
  // (per user request) and potentially by errorLogger middleware with request context.
  // We just need to send the correct response.

  if (err instanceof AppException) {
    const errorData = {
      code: err.code,
      message: err.message,
      details: err.details,
    };

    const response = {
      success: false,
      error: errorData,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };

    res.status(err.statusCode).json(response);
    return;
  }

  // For unknown errors
  logger.error(err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString(),
  });
};
