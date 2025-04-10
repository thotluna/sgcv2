import { Response, Request } from 'express'
import { AuthRepository } from './auth.repository'
import { AuthError, DBErrorConexion } from './errors'

export class AuthController {
  static validationClientCode = async (req: Request, res: Response) => {
    const { clientCode } = req.body

    const repository = new AuthRepository()

    try {
      const hasCode = await repository.validateCodeClient(clientCode)

      if (!hasCode) {
        res.status(401).send({
          status: 'fail',
          message: 'codigo no valido',
        })
        return
      }
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

    const repository = new AuthRepository()
    try {
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

    const repository = new AuthRepository()
    try {
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
    const authorizationHeader = req.headers.autorization || ''

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
}
