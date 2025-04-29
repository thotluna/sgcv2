import { AUTH_ERROR_CODES } from '@auth'
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
  private SECRET: string

  constructor(secret: string) {
    this.SECRET = secret
  }

  public crearToken(email: string, expires?: number): string {
    assert(email, 'Email is required')

    const expiresIn = expires || EXPIRATION_TIME

    try {
      const token = jwt.sign({ id: email, email }, this.SECRET!, {
        expiresIn: expiresIn,
      })
      return token
    } catch {
      throw new CustomerCodeTokeError('Falló la creación del token.')
    }
  }

  public verificarToken(token: string): VerifiedTokenPayload {
    try {
      const decode = jwt.verify(token, this.SECRET!) as VerifiedTokenPayload
      return decode
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new CustomerCodeTokeError(
          AUTH_ERROR_CODES.TOKEN_INVALID,
          AUTH_ERROR_CODES.TOKEN_EXPIRED,
          401,
        )
      }
      if ((error as Error).name === 'JsonWebTokenError') {
        throw new CustomerCodeTokeError(
          AUTH_ERROR_CODES.TOKEN_INVALID,
          AUTH_ERROR_CODES.TOKEN_MALFORMED,
          401,
        )
      }
      throw new CustomerCodeTokeError(
        AUTH_ERROR_CODES.TOKEN_INVALID,
        AUTH_ERROR_CODES.TOKEN_INVALID,
        401,
      )
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
