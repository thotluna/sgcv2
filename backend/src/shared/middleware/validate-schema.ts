import z from 'zod';
import { NextFunction, RequestHandler, Response } from 'express';
import { ValidationException } from '../exceptions/http-exceptions';

export const validateSchema = <T extends z.ZodTypeAny>(
  schema: T,
  source: 'body' | 'query' | 'params' = 'body'
): RequestHandler => {
  return (req: any, _res: Response, next: NextFunction): void => {
    const validationResult = schema.safeParse(req[source]);

    if (!validationResult.success) {
      throw new ValidationException(
        'Validation failed',
        validationResult.error.issues.reduce(
          (acc, issue) => {
            const path = issue.path.join('.');

            if (!acc[path]) {
              acc[path] = issue.message;
            }

            return acc;
          },
          {} as Record<string, string>
        )
      );
    }

    // Overwrite the specific source with validated data
    try {
      req[source] = validationResult.data;
    } catch (e) {
      // Fallback for read-only properties (like req.query in some Express setups)
      Object.defineProperty(req, source, {
        value: validationResult.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }

    return next();
  };
};



