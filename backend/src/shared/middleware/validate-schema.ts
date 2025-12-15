import z from 'zod';
import { NextFunction, RequestHandler, Response } from 'express';
import { TypedRequest } from '../../types/express-interfaces/types';
import { ValidationException } from '../exceptions/http-exceptions';

export const validateSchema = <T extends z.ZodTypeAny>(schema: T): RequestHandler => {
  return (req: TypedRequest<T>, _res: Response, next: NextFunction): void => {
    const validationResult = schema.safeParse(req.body);

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

    // Overwrite the req.body with validated data
    req.body = validationResult.data as T;

    next();
  };
};
