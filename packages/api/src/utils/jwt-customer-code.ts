import { TokenError, SYSTEM_ERROR, AUTH_ERROR } from '@auth'
import { assert } from 'console'
import jwt from 'jsonwebtoken'

interface CustomerCodePayload {
  email: string
}

interface VerifiedTokenPayload extends CustomerCodePayload {
  iat: number
  exp: number
}

const EXPIRATION_TIME = '24h'

export class CustomerCodeJwtHelper {
  private SECRET: string

  constructor(secret: string) {
    this.SECRET = secret
  }

  public crearToken(email: string, expires?: number): string {
    const expiresIn = expires || EXPIRATION_TIME

    try {
      const token = jwt.sign({ id: email, email }, this.SECRET!, {
        expiresIn: expiresIn,
      })
      return token
    } catch (error) {
      throw new TokenError(
        SYSTEM_ERROR.UNKNOWN_ERROR,
        SYSTEM_ERROR.UNKNOWN_ERROR,
        {
          message: (error as Error).message,
          timestamp: Date.now(),
        },
      )
    }
  }

  public verificarToken(token: string): VerifiedTokenPayload {
    try {
      const decode = jwt.verify(token, this.SECRET!) as VerifiedTokenPayload
      return decode
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenError(
          AUTH_ERROR.TOKEN_INVALID,
          AUTH_ERROR.TOKEN_EXPIRED,
          {
            message: (error as Error).message,
            timestamp: Date.now(),
          },
        )
      }
      if ((error as Error).name === 'JsonWebTokenError') {
        throw new TokenError(
          AUTH_ERROR.TOKEN_INVALID,
          AUTH_ERROR.TOKEN_MALFORMED,
          {
            message: (error as Error).message,
            timestamp: Date.now(),
          },
        )
      }
      throw new TokenError(AUTH_ERROR.TOKEN_INVALID, AUTH_ERROR.TOKEN_INVALID, {
        message: (error as Error).message,
        timestamp: Date.now(),
      })
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
      throw new TokenError(AUTH_ERROR.TOKEN_INVALID, AUTH_ERROR.TOKEN_INVALID, {
        message: (error as Error).message,
        timestamp: Date.now(),
      })
    }
  }
}
