import { ValidationError } from '@api/errors'
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import type { AnyZodObject } from 'zod'

export const schemaValidation =
  (schema: AnyZodObject) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ValidationError({
            code: error.issues[0].message,
            message: error.issues[0].message,
            field: error.issues[0].path[0].toString(),
            details: { timestamp: Date.now() },
          }),
        )
      }
      next(error)
    }
  }
