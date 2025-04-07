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
        code: clientCode,
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
}
