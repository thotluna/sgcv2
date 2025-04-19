import { Response, Request } from 'express'
import { SUPABASE_URLs } from './auth.repository'
import { AuthError, DBErrorConexion } from './errors'
import { AuthSercice as AuthService } from './auth.service'

export class AuthController {
  private service: AuthService

  constructor(service: AuthService) {
    this.service = service
  }

  validationClientCode = async (req: Request, res: Response) => {
    const { clientCode } = req.body

    try {
      await this.service.validateCodeClient(clientCode)

      res.send({
        status: 'ok',
        message: clientCode,
      })
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(401).send({
          status: 'fail',
          message: error.message,
        })
        return
      }
      if (error instanceof DBErrorConexion) {
        res.status(401).send({
          status: 'fail',
          message: 'error en la conexion. por favor intentelo mas tarde',
        })
        return
      }
    }
  }

  singUp = async (req: Request, res: Response) => {
    const { email, password, clientCode } = req.body

    try {
      const data = await this.service.singUp(email, password, clientCode)
      res.send({ status: 'ok', message: 'ok', data })
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(400).send({
          status: 'fail',
          message: error.message,
        })
        return
      }
      res.status(500).send({
        status: 'fail',
        message: 'error en la conexion. por favor intentelo mas tarde',
      })
    }
  }

  singIn = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
      const data = await this.service.singIn(email, password)

      res.send({ status: 'ok', message: 'ok', data })
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(400).send({
          status: 'fail',
          message: error.message,
        })
        return
      }
      res.status(500).send({
        status: 'fail',
        message: 'error en la conexion. por favor intentelo mas tarde',
      })
    }
  }

  checkSession = async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.autorization

    if (authorizationHeader) {
      const token = (authorizationHeader as string).split(' ')[1]
      const data = await this.service.checkSession(token)
      if (data?.user !== null) {
        res.send({
          status: 'ok',
          data,
        })
        return
      } else {
        res.status(401).send({
          status: 'fail',
          message: 'Token no valido',
        })
        return
      }
    }
    res.status(401).send({
      status: 'fail',
      message: 'Token no valido',
    })
  }

  async authorize(req: Request, res: Response) {
    const provider = req.query.provider as string

    console.log('provider', provider)

    try {
      const { data, codeVerifier } = await this.service.authorization(provider)

      const url = new URL(SUPABASE_URLs.AUTHORIZATION)

      Object.keys(data).forEach(key => {
        url.searchParams.append(key, data[key])
      })

      res.send({
        data: {
          url,
          codeVerifier,
        },
      })
    } catch (error) {
      console.error(error)
      res.status(500).send({
        status: 'fail',
        message: 'error en la conexion. por favor intentelo mas tarde',
      })
    }
  }

  callback = async (req: Request, res: Response) => {
    const { 'sb-rzfvzqhceahqpjzjswxz-auth-code-verify': codeVerifier } =
      req.cookies
    const { code } = req.query

    const { error, error_description } = req.query
    if (error && error_description === 'Database error saving new user') {
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

    try {
      const {
        access_token: accessToken,
        expires_at: expiresAt,
        refresh_token: refreshToken,
      } = await this.service.callback(code as string, codeVerifier)

      res
        .cookie('sr-sb-access_token', accessToken, {
          expires: new Date(expiresAt * 1000),
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 1000,
        })
        .cookie('sr-sb-refresh_token', refreshToken, {
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
        res.status(401).send({
          status: 'fail',
          message: error.message,
        })
        return
      }
      if (error instanceof DBErrorConexion) {
        res.status(401).send({
          status: 'fail',
          message: 'error en la conexion. por favor intentelo mas tarde',
        })
        return
      }
    }
  }
}
