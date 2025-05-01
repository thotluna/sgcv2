import { AUTH_ERROR, TokenError } from '@auth'
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
      throw new TokenError(
        AUTH_ERROR.TOKEN_REQUIRED,
        AUTH_ERROR.TOKEN_REQUIRED,
        {
          timestamp: Date.now(),
        },
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
