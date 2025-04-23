import { AuthResponseBuilder } from '../utils/auth-response-builder'
import { SUPABASE_URLs } from './auth.repository'
import { AuthService } from './auth.service'
import { AuthError, DBErrorConexion } from './errors'
import { ApiResponse, ClientCodeType } from '@sgcv2/shared'
import { NextFunction, Request, Response } from 'express'

export class AuthController {
  private service: AuthService

  constructor(service: AuthService) {
    this.service = service
  }

  validationClientCode = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { clientCode } = req.body

    try {
      await this.service.validateCodeClient(clientCode)

      const response: ApiResponse<ClientCodeType> = {
        status: 'success',
        data: clientCode,
        code: 200,
      }

      res.send(response)
    } catch (error) {
      if (error instanceof AuthError) {
        res
          .status(401)
          .send(
            new AuthResponseBuilder()
              .status('error')
              .code(401)
              .message(error.message)
              .build(),
          )
        return
      }
      if (error instanceof DBErrorConexion) {
        res
          .status(500)
          .send(
            new AuthResponseBuilder()
              .status('error')
              .code(500)
              .message('error en la conexion. por favor intentelo mas tarde')
              .build(),
          )
        return
      }
      next(error)
    }
  }

  singUp = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, clientCode } = req.body

    try {
      const data = await this.service.singUp(email, password, clientCode)
      res.send(new AuthResponseBuilder().data(data).build())
    } catch (error) {
      if (error instanceof AuthError) {
        res
          .status(400)
          .send(
            new AuthResponseBuilder()
              .status('error')
              .code(400)
              .message(error.message)
              .build(),
          )
        return
      }
      next(error)
    }
  }

  singIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    try {
      const data = await this.service.singIn(email, password)

      res.send(new AuthResponseBuilder().data(data).build())
    } catch (error) {
      if (error instanceof AuthError) {
        res
          .status(400)
          .send(
            new AuthResponseBuilder()
              .status('error')
              .code(400)
              .message(error.message)
              .build(),
          )
        return
      }
      next(error)
    }
  }

  authorize = async (req: Request, res: Response, next: NextFunction) => {
    const provider = req.query.provider as string

    try {
      const resp = await this.service.authorization(provider)

      const { data, codeVerifier } = resp
      const url = new URL(SUPABASE_URLs.AUTHORIZATION)

      Object.keys(data).forEach(key => {
        url.searchParams.append(key, data[key])
      })

      res.send(new AuthResponseBuilder().data({ url, codeVerifier }).build())
    } catch (error) {
      next(error)
    }
  }

  callback = async (req: Request, res: Response, next: NextFunction) => {
    const { code, error, error_description } = req.query

    if (
      !code ||
      (error && error_description === 'Database error saving new user')
    ) {
      res.redirect('http://localhost:3000/?singUp=true')
      return
    }
    if (!code) {
      res.status(401).send({
        status: 'fail',
        message: 'Se requiere codigo de autorizacion',
      })
      return
    }

    const { 'code-verify': codeVerifier } = req.cookies
    try {
      const {
        access_token: accessToken,
        expires_at: expiresAt,
        refresh_token: refreshToken,
      } = await this.service.callback(code as string, codeVerifier)

      res
        .cookie('access_token', accessToken, {
          expires: new Date(expiresAt * 1000),
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 1000,
        })
        .cookie('refresh_token', refreshToken, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .redirect(`${process.env.FRONTEND_URL}/auth/callback`)
      return
    } catch (error) {
      if (error instanceof AuthError) {
        res
          .status(401)
          .send(
            new AuthResponseBuilder()
              .status('error')
              .code(401)
              .message(error.message)
              .build(),
          )
        return
      }
      if (error instanceof DBErrorConexion) {
        res.status(401).send({
          status: 'fail',
          message: 'error en la conexion. por favor intentelo mas tarde',
        })
        return
      }
      next(error)
    }
  }

  // session = (_req: Request, _res: Response, _next: NextFunction) => {
  //   throw new Error('Method not implemented.')
  // }
  getUser = (req: Request, res: Response, next: NextFunction) => {
    const { access_token } = req.cookies

    try {
      this.service.getUser(access_token)
    } catch (error) {
      if (error instanceof AuthError) {
        res
          .status(401)
          .send(
            new AuthResponseBuilder()
              .status('error')
              .code(401)
              .message(error.message)
              .build(),
          )
        return
      }
      next(error)
    }
  }
}
