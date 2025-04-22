import { AuthResponseBuilder } from '../utils/auth-response-builder'
import { NextFunction, Request, Response } from 'express'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    // Si los headers ya fueron enviados, delega al handler por defecto de Express
    return next(err)
  }

  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500

  res.status(statusCode)
  res.type('application/json')

  res.send(
    new AuthResponseBuilder()
      .status('error')
      .code(statusCode)
      .message('¡Ups! Algo salió mal.')
      .build(),
  )
}
