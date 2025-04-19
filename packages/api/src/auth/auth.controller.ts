import { Response, Request } from 'express'
import { AuthRepository, SUPABASE_URLs } from './auth.repository'
import { AuthError, DBErrorConexion } from './errors'
import { generatePKCEParams } from './oauth'

export class AuthController {
  static validationClientCode = async (req: Request, res: Response) => {
    const { clientCode } = req.body

    try {
      const repository = new AuthRepository()
      await repository.validateCodeClient(clientCode)

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

  static singUp = async (req: Request, res: Response) => {
    const { email, password, clientCode } = req.body

    try {
      const repository = new AuthRepository()
      await repository.validateCodeClient(clientCode)
      const data = await repository.singUp(email, password)
      if (data) {
        await repository.closeCodeClient(clientCode)
      }
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

  static singIn = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
      const repository = new AuthRepository()
      const data = await repository.singIn(email, password)

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

  static checkSession = async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.autorization

    if (authorizationHeader) {
      const token = (authorizationHeader as string).split(' ')[1]
      const repository = new AuthRepository()
      const data = await repository.checkSession(token)
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

  static async authorize(req: Request, res: Response) {
    const provider = req.query.provider as string
    const PKCEPparams = await generatePKCEParams()

    try {
      const conf: Record<string, string> = {
        provider,
        redirect_to: 'http://localhost:3001/v1/auth/callback',
        code_challenge: PKCEPparams.codeChallenge,
        code_challenge_method: 'S256',
      }

      const url = new URL(SUPABASE_URLs.AUTHORIZATION)

      Object.keys(conf).forEach(key => {
        url.searchParams.append(key, conf[key])
      })

      res.send({
        data: {
          url,
          codeVerifier: PKCEPparams.codeVerifier,
        },
      })
    } catch {
      res.status(500).send({
        status: 'fail',
        message: 'error en la conexion. por favor intentelo mas tarde',
      })
    }
  }

  static callback = async (req: Request, res: Response) => {
    const { 'sb-rzfvzqhceahqpjzjswxz-auth-code-verify': codeVerifier } =
      req.cookies
    const { code } = req.query
    if (!code) {
      res.status(401).send({
        status: 'fail',
        message: 'Se requiere codigo de autorizacion',
      })
      return
    }
    const repository = new AuthRepository()
    try {
      const result = await repository.callback(code as string, codeVerifier)
      const {
        access_token: accessToken,
        expires_at: expiresAt,
        refresh_token: refreshToken,
      } = result

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
