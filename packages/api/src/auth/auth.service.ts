import { AuthError } from './errors'
import { generatePKCEParams } from './oauth'
import { AuthsRepository } from './types'
import jwt from 'jsonwebtoken'

type TokenPayload = {
  email: string
  exp: number
}

export class AuthService {
  private repository: AuthsRepository

  constructor(repository: AuthsRepository) {
    this.repository = repository
  }

  async customerCode(email: string) {
    const { SECRET } = process.env
    const token = jwt.sign({ email }, SECRET!, { expiresIn: '24h' })

    return await this.repository.saveCustomerCode(token, email)
  }

  async validateCustomerCode(code: string) {
    try {
      this.validateJwt(code)

      return await this.repository.validateCustomerCode(code)
    } catch (error) {
      if ((error as Error).name === 'JsonWebTokenError') {
        throw new AuthError('Invalid_code')
      }
      throw error
    }
  }

  private validateJwt(code: string, email?: string | undefined) {
    const { SECRET } = process.env
    const decoded = jwt.verify(code, SECRET!)
    if (!decoded) {
      throw new AuthError('Invalid_code')
    }

    const { exp, email: decodedEmail } = decoded as TokenPayload

    if (exp < Date.now() / 1000) {
      throw new AuthError('Expired_code')
    }

    if (email && decodedEmail !== email) {
      throw new AuthError('Invalid_code')
    }
  }

  async signUp(email: string, password: string, code: string) {
    this.validateJwt(code, email)

    await this.repository.validateCustomerCode(code)
    const data = await this.repository.signUp(email, password)
    if (data) {
      await this.closeCodeClient(code)
    }
    return data
  }

  async signIn(email: string, password: string) {
    return await this.repository.signIn(email, password)
  }

  async closeCodeClient(codeClient: string) {
    return await this.repository.closeCustomerCode(codeClient)
  }

  async authorization(provider: string) {
    const PKCEPparams = await generatePKCEParams()

    const data: Record<string, string> = {
      provider,
      redirect_to: 'http://localhost:3001/v1/auth/callback',
      code_challenge: PKCEPparams.codeChallenge,
      code_challenge_method: 'S256',
    }

    return { data, codeVerifier: PKCEPparams.codeVerifier }
  }

  async callback(code: string, codeVerifier: string) {
    return await this.repository.callback(code, codeVerifier)
  }

  getUser(access_token: string) {
    return this.repository.getUser(access_token)
  }
}
