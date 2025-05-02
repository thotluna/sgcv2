import { ApiResponseBuilder } from '@api/types'
import { AUTH_ERROR, AuthService, SUPABASE_URLs, UserResponse } from '@auth'
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
        new ApiResponseBuilder().status('success').data({ token }).build(),
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

      // const response: ApiResponse<ClientCodeType> = {
      //   status: 'success',
      //   data: code,
      //   code: 200,
      // }

      const response = new ApiResponseBuilder()
        .status('success')
        .data({ code })
        .build()

      res.send(response)
    } catch (error) {
      next(error)
    }
  }

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, code } = req.body

    try {
      const data = await this.service.signUp(email, password, code)

      res.send(new ApiResponseBuilder<UserResponse | null>().data(data).build())
    } catch (error) {
      next(error)
    }
  }

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    try {
      const data = await this.service.signIn(email, password)
      res.send(new ApiResponseBuilder().data(data).build())
    } catch (error) {
      next(error)
    }
  }

  authorize = async (req: Request, res: Response, next: NextFunction) => {
    const provider = req.query.provider as string

    try {
      const resp = await this.service.authorization(provider)

      const { data, codeVerifier } = resp
      const url = new URL(
        `${process.env.SUPABASE_URL}${SUPABASE_URLs.AUTHORIZATION}`,
      )

      Object.keys(data).forEach(key => {
        url.searchParams.append(key, data[key])
      })

      res.send(new ApiResponseBuilder().data({ url, codeVerifier }).build())
    } catch (error) {
      next(error)
    }
  }

  callback = async (req: Request, res: Response, next: NextFunction) => {
    const { code, error, error_description } = req.query

    //TODO: remplace by const or const errors
    if (
      !code ||
      (error && error_description === 'Database error saving new user')
    ) {
      const url = new URL(
        `${process.env.FRONTEND_URL}:${process.env.PORT_FRONTEND}/register`,
      )

      const searchParams = url.searchParams
      searchParams.append('error', 'authentication')
      searchParams.append(
        'error_description',
        req.t(AUTH_ERROR.CLIENT_CODE_REQUIRED),
      )

      res.redirect(url.toString())
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

        .redirect(
          `${process.env.FRONTEND_URL}:${process.env.PORT_FRONTEND}/auth/callback`,
        )
      return
    } catch (error) {
      next(error)
    }
  }

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    const tok = req.headers['authorization']

    if (!tok) {
      res.status(401).send(
        new ApiResponseBuilder<null>()
          .status('error')
          .httpCode(401)
          .message(req.t(AUTH_ERROR.TOKEN_REQUIRED))
          .errors([
            {
              code: AUTH_ERROR.TOKEN_REQUIRED,
              message: req.t(AUTH_ERROR.TOKEN_REQUIRED),
            },
          ])
          .build(),
      )
      return
    }

    const token = tok!.split(' ')[1]

    try {
      const userResponse = await this.service.getUser(token)

      res.send(new ApiResponseBuilder().data(userResponse).build())
    } catch (error) {
      next(error)
    }
  }
}
