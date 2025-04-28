import { AuthResponseBuilder } from '../utils/auth-response-builder'
import { CustomerCodeTokeError } from '../utils/jwt-customer-code'
import { AuthService } from './auth.service'
import { SUPABASE_URLs } from './constants'
import { AuthError, DBErrorConexion } from './errors'
import { ApiResponse, ClientCodeType } from '@sgcv2/shared'
import { NextFunction, Request, Response } from 'express'

export class AuthController {
  private service: AuthService

  constructor(service: AuthService) {
    this.service = service
  }

  customerCode = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body

    try {
      const token = await this.service.customerCode(email)
      res.send(
        new AuthResponseBuilder().status('success').data({ token }).build(),
      )
    } catch (error) {
      next(error)
    }
  }

  validationCustomerCode = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { code } = req.body

    try {
      await this.service.validateCustomerCode(code)

      const response: ApiResponse<ClientCodeType> = {
        status: 'success',
        data: code,
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
              .message(req.t(error.message))
              .build(),
          )
        return
      }
      if (error instanceof CustomerCodeTokeError) {
        res
          .status(400)
          .send(
            new AuthResponseBuilder()
              .status('error')
              .code(400)
              .message(req.t(error.message))
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
              .message(req.t(error.message))
              .build(),
          )
        return
      }
      next(error)
    }
  }

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, code } = req.body

    try {
      const data = await this.service.signUp(email, password, code)
      res.send(new AuthResponseBuilder().data(data).build())
    } catch (error) {
      if (error instanceof AuthError) {
        res
          .status(400)
          .send(
            new AuthResponseBuilder()
              .status('error')
              .code(400)
              .message(req.t(error.message))
              .build(),
          )
        return
      }
      if (error instanceof CustomerCodeTokeError) {
        res
          .status(400)
          .send(
            new AuthResponseBuilder()
              .status('error')
              .code(400)
              .message(req.t(error.message))
              .build(),
          )
        return
      }
      next(error)
    }
  }

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    try {
      const data = await this.service.signIn(email, password)

      res.send(new AuthResponseBuilder().data(data).build())
    } catch (error) {
      if (error instanceof AuthError) {
        res
          .status(400)
          .send(
            new AuthResponseBuilder()
              .status('error')
              .code(400)
              .message(req.t(error.message))
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

    if (error && error_description === 'Database error saving new user') {
      res.redirect('http://localhost:3000/?signUp=true')
      return
    }
    if (!code) {
      res.redirect('http://localhost:3000/?signUp=true')
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
              .message(req.t(error.message))
              .build(),
          )
        return
      }
      if (error instanceof DBErrorConexion) {
        res.status(401).send({
          status: 'fail',
          message: req.t('db_conexion_error'),
        })
        return
      }
      next(error)
    }
  }

  // session = (_req: Request, _res: Response, _next: NextFunction) => {
  //   throw new Error('Method not implemented.')
  // }
  getUser = async (req: Request, res: Response, next: NextFunction) => {
    const tok = req.headers['authorization']

    if (!tok) {
      res
        .status(401)
        .send(
          new AuthResponseBuilder()
            .status('error')
            .code(401)
            .message(req.t('token_required'))
            .build(),
        )
      return
    }

    const token = tok!.split(' ')[1]

    try {
      const user = await this.service.getUser(token)
      if (!user.user) {
        res
          .status(401)
          .send(
            new AuthResponseBuilder()
              .status('error')
              .code(401)
              .message(req.t('token_without_user'))
              .build(),
          )
        return
      }
      res.send(new AuthResponseBuilder().data(user).build())
    } catch (error) {
      if (error instanceof AuthError) {
        res
          .status(401)
          .send(
            new AuthResponseBuilder()
              .status('error')
              .code(401)
              .message(req.t(error.message))
              .build(),
          )
        return
      }
      next(error)
    }
  }
}
