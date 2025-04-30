import translate from '../locales/en/translation.json'
import { AuthResponseBuilder } from '../utils/auth-response-builder'
import logger from '../utils/logger'
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

  // Registrar el error
  logger.error(`${customError.name} ${customError.code || err.message}`, {
    statusCode: customError.statusCode || 500,
    code: customError.code,
    message: translate[customError.message || customError.code],
    debugger: JSON.stringify(customError.details),
    stack: err.stack,
    originalError: err,
  })

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
