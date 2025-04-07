import { Response, Request } from 'express'
import { AuthRepository } from './auth.repository'

export class AuthController {
  static validationClientCode = async (req: Request, res: Response) => {
    const { clientCode } = req.body

    const repository = new AuthRepository()

    try {
      if (!(await repository.validateCodeClient(clientCode))) {
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
    } catch {
      console.log('entando')
      res.status(401).send({
        status: 'fail',
        message: 'error en la conexion. por favor intentelo mas tarde',
      })
    }
  }
}
