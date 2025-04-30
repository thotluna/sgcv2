import { AUTH_ERROR_CODES, AuthError } from '../auth/errors'
import { CustomerCodeJwtHelper } from '@utils'
import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'

export interface CustomRequest extends Request {
  token: string | JwtPayload
}

export async function verificarToken(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    if (!req.header('Authorization')) {
      throw new AuthError(
        AUTH_ERROR_CODES.TOKEN_REQUIRED,
        AUTH_ERROR_CODES.TOKEN_REQUIRED,
        401,
      )
    }

    const token = req.header('Authorization')?.split(' ')[1]

    const { JWT_SECRET } = process.env
    new CustomerCodeJwtHelper(JWT_SECRET!).verificarToken(token!)
    ;(req as CustomRequest).token = token!
    next()
  } catch (error) {
    next(error)
  }
}
