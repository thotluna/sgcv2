import { ValidationError } from '@auth'
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import type { AnyZodObject } from 'zod'

//TODO: This function should return a ValidationError for the error-handler middleware to process.
export const schemaValidation =
  (schema: AnyZodObject) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req)

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new ValidationError(
            error.issues[0].message,
            req.t(error.issues[0].message),
            {
              timestamp: Date.now(),
              field: error.issues[0].path[0],
            },
          ),
        )
      }

      next(error)
    }
  }
