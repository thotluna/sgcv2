import z from 'zod';
import { NextFunction, RequestHandler, Response } from 'express';
import { TypedRequest } from '../../types/express/types';
import { ResponseHelper } from '../utils/response.helpers';

export const validateSchema = <T extends z.ZodTypeAny>(schema: T): RequestHandler => {
  return (req: TypedRequest<T>, res: Response, next: NextFunction): void => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      ResponseHelper.validationError(
        res,
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
      return;
    }

    // Overwrite the req.body with validated data
    req.body = validationResult.data as T;

    next();
  };
};
