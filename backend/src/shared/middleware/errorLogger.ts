import { Request, Response, NextFunction } from 'express';
import logger from '@config/logger';

interface ErrorLogData {
    requestId: string;
    error: {
        message: string;
        stack?: string;
        name: string;
    };
    request: {
        method: string;
        url: string;
        params: any;
        query: any;
        body: any;
        ip: string;
    };
    user?: string;
}

export const errorLogger = (
    err: Error,
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    // Sanitizar body para no loggear datos sensibles
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
    if (sanitizedBody.token) sanitizedBody.token = '[REDACTED]';

    const errorLogData: ErrorLogData = {
        requestId: req.id,
        error: {
            message: err.message,
            stack: err.stack,
            name: err.name
        },
        request: {
            method: req.method,
            url: req.url,
            params: req.params,
            query: req.query,
            body: sanitizedBody,
            ip: req.ip || 'unknown'
        }
    };

    if (req.user?.id) {
        errorLogData.user = req.user.id;
    }

    logger.error('Error occurred', errorLogData);

    // Pasar al siguiente error handler
    next(err);
};