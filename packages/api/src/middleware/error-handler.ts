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

  const customError = err as Partial<BusinessErrorShape>
  const httpCode =
    typeof customError.httpCode === 'number'
      ? customError.httpCode
      : res.statusCode && res.statusCode !== 200
        ? res.statusCode
        : 500

  res.status(httpCode)
  res.type('application/json')

  const builder = new AuthResponseBuilder()
    .status('error')
    .code(customError.code || err.message)
    .message(req.t(customError.message || customError.code || err.message))

  if (typeof customError.httpCode === 'number') {
    builder.httpCode(customError.httpCode)
  } else {
    builder.httpCode(httpCode)
  }

  res.send(builder.build())
}
