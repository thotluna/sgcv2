import { ZodError, type AnyZodObject } from 'zod'
import { Request, Response, NextFunction } from 'express'

export const schemaValidation =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log({ body: req.body })
      await schema.parseAsync(req)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send({
          status: 'fail',
          message: 'Error de validación del codigo de cliente',
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
