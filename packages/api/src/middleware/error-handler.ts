import { AuthResponseBuilder } from '../utils/auth-response-builder'
import type { BaseError } from '@sgcv2/shared'
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

  const customError = err as Partial<BaseError>

  res.status(customError.statusCode || 500)
  res.type('application/json')

  const builder = new AuthResponseBuilder()
    .status('error')
    .code(customError.code || err.message)
    .message(req.t(customError.message || customError.code || err.message))

  if (typeof customError.statusCode === 'number') {
    builder.httpCode(customError.statusCode)
  } else {
    builder.httpCode(500)
  }

  res.send(builder.build())
}
