import { Request, Response, NextFunction } from 'express';
import logger from '@config/logger';
import { AppException } from '@shared/exceptions/app.exception';

/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: RESOURCE_NOT_FOUND
 *             message:
 *               type: string
 *               example: The requested resource does not exist.
 *             details:
 *               type: object
 *               nullable: true
 */
export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // If the error is an instance of AppException, it has already been logged by the constructor
  // (per user request) and potentially by errorLogger middleware with request context.
  // We just need to send the correct response.

  if (err instanceof AppException || ((err as any).statusCode && (err as any).code)) {
    const appErr = err as any;
    const errorData = {
      code: appErr.code,
      message: appErr.message,
      details: appErr.details,
    };

    const response = {
      success: false,
      error: errorData,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };

    res.status(appErr.statusCode || 400).json(response);
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
