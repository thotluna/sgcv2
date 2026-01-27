import logger from '@config/logger';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface LogMetadata {
  requestId: string;
  method: string;
  url: string;
  ip: string;
  userAgent?: string;
  statusCode?: number;
  duration?: string;
  userId?: string;
}

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Generar ID único para el request
  req.id = uuidv4();

  // Timestamp de inicio
  const startTime = Date.now();

  // Log de request entrante
  const incomingLogData: LogMetadata = {
    requestId: req.id,
    method: req.method,
    url: req.url,
    ip: req.ip || 'unknown',
    userAgent: req.get('user-agent'),
  };

  if (req.user?.id) {
    incomingLogData.userId = req.user.id;
  }

  logger.http('Incoming request', incomingLogData);

  // Capturar el response
  const originalSend = res.send;
  res.send = function (data): Response {
    const duration = Date.now() - startTime;

    const completedLogData: LogMetadata = {
      requestId: req.id,
      method: req.method,
      url: req.url,
      ip: req.ip || 'unknown',
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };

    if (req.user?.id) {
      completedLogData.userId = req.user.id;
    }

    logger.http('Request completed', completedLogData);

    return originalSend.call(this, data);
  };

  next();
};
