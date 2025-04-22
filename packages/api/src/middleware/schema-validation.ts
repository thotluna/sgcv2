import { Request, Response, NextFunction } from 'express'
import { ZodError, type AnyZodObject } from 'zod'
import { AuthResponseBuilder } from '../utils/auth-response-builder'

export const schemaValidation =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(
          new AuthResponseBuilder()
            .code(400)
            .status('error')
            .message(error.issues.map(issue => issue.message).join(', '))
            .build(),
        )
        return
      }

      next(error)
    }
  }
