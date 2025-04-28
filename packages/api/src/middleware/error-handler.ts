import { AuthResponseBuilder } from '../utils/auth-response-builder'
import type { BusinessErrorShape } from '@sgcv2/shared'
import { NextFunction, Request, Response } from 'express'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err)
  }

  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500

  res.status(statusCode)
  res.type('application/json')

  const customError = err as Partial<BusinessErrorShape>

  res.send(
    new AuthResponseBuilder()
      .status('error')
      .code(customError.code || statusCode)
      .message(customError.code ? req.t(customError.code) : req.t(err.message))
      .build(),
  )
}
