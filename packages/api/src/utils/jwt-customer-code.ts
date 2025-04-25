import { createErrorFactory } from '@sgcv2/shared'
import { assert } from 'console'
import jwt from 'jsonwebtoken'

interface CustomerCodePayload {
  email: string
}

interface VerifiedTokenPayload extends CustomerCodePayload {
  iat: number
  exp: number
}

export const CustomerCodeTokeError = createErrorFactory('CustomerCodeTokeError')

const EXPIRATION_TIME = '24h'

export class CustomerCodeJwtHelper {
  private SECRET = process.env.SECRET

  public crearToken(email: string): string {
    assert(email, 'Email is required')

    try {
      const token = jwt.sign({ email }, this.SECRET!, {
        expiresIn: EXPIRATION_TIME,
      })
      return token
    } catch (error) {
      console.error('Error al crear el token:', error)
      throw new CustomerCodeTokeError('Falló la creación del token.')
    }
  }

  public verificarToken(token: string): VerifiedTokenPayload {
    assert(token, 'Token is required')

    try {
      const decode = jwt.verify(token, this.SECRET!) as VerifiedTokenPayload

      return decode
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new CustomerCodeTokeError('Invalid_code')
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new CustomerCodeTokeError('Expired_code')
      }
      console.error('Error, intent verifier token', (error as Error).message)
      throw new CustomerCodeTokeError('Invalid_code')
    }
  }

  public getPayload(token: string): VerifiedTokenPayload | null {
    assert(token, 'Token is required')

    try {
      const decodificado = jwt.decode(token)

      if (
        decodificado &&
        typeof decodificado === 'object' &&
        'email' in decodificado
      ) {
        return decodificado as VerifiedTokenPayload
      }

      return null
    } catch (error) {
      console.error('Error decoding unverified token:', error)
      return null
    }
  }
}
