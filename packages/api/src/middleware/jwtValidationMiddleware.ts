import { NextFunction, Request, Response } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'

export interface CustomRequest extends Request {
  token: string | JwtPayload
}

export function verificarToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      res.status(401).json({ message: 'Token no proporcionado' })
      return
    }

    const decoded = verify(token, process.env.SECRET_KEY!)

    ;(req as CustomRequest).token = decoded

    next()
  } catch {
    res.status(401).send('Please authenticate')
  }
}
