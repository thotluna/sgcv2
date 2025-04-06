import { Response, Request } from 'express'

export class AuthController {
  static validationClientCode = async (req: Request, res: Response) => {
    const { clientCode } = req.body
    //TODO: validar en BBDD

    const data = {
      status: 'ok',
      code: clientCode,
    }
    res.send(data)
  }
}
