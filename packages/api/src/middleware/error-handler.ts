import { Request, Response } from 'express'
import { AuthResponseBuilder } from '../utils/auth-response-builder'

export function errorHandler(_err: Error, _req: Request, res: Response) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)

  res.send(
    new AuthResponseBuilder()
      .status('error')
      .code(statusCode)
      .message('¡Ups! Algo salió mal.')
      .build(),
  )
}
