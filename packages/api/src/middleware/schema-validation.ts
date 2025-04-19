import { ZodError, type AnyZodObject } from 'zod'
import { Request, Response, NextFunction } from 'express'

export const schemaValidation =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('schemaValidation', req.headers)

    try {
      await schema.parseAsync(req)
      next()
    } catch (error) {
      console.log(error)
      if (error instanceof ZodError) {
        res.status(400).send({
          status: 'fail',
          message: error.issues.map(issue => issue.message).join(', '),
          error: error.issues,
        })
        return
      }

      res.status(500).send({
        status: 'fail',
        message: 'internal server error',
      })
    }
  }
