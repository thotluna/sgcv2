import { AuthResponseBuilder } from '../utils/auth-response-builder'
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import type { AnyZodObject } from 'zod'

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
            // translate Zod issue messages using req.t
            .message(error.issues.map(issue => req.t(issue.message)).join(', '))
            .build(),
        )
        return
      }

      next(error)
    }
  }
