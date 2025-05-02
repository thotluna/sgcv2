import * as translate from '../locales/en/translation.json'
import logger from '../utils/logger'
import { BaseError } from '@api/errors/errors'
import { ApiResponseBuilder, STATUS } from '@api/types'
import { NextFunction, Request, Response } from 'express'

// Definir un registro de traducciones
const translations: Record<string, string> = translate

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
  const errorMessageKey =
    (customError.message || customError.code || err.message) ?? 'unknown_error'
  const translatedMessage = translations[errorMessageKey] ?? errorMessageKey

  logger.error(`${customError.name} ${customError.code || err.message}`, {
    statusCode: customError.statusCode || 500,
    code: customError.code,
    message: translatedMessage,
    debugger: JSON.stringify(customError.details),
    stack: err.stack,
    originalError: err,
  })

  res.status(customError.statusCode || 500)
  res.type('application/json')

  const builder = new ApiResponseBuilder<null>()
    .status(STATUS.ERROR)
    .message(req.t(customError.message || customError.code || err.message))
    .httpCode(customError.statusCode || 500)

  builder.errors([
    {
      code: customError.code || err.message,
      message: req.t(customError.message || customError.code || err.message),
    },
  ])

  res.send(builder.build())
}
