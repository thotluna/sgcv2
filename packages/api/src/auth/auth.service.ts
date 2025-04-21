import { generatePKCEParams } from './oauth'
import { AuthsRepository } from './types'

export class AuthService {
  private repository: AuthsRepository

  constructor(repository: AuthsRepository) {
    this.repository = repository
  }

  async validateCodeClient(codeClient: string) {
    return await this.repository.validateCodeClient(codeClient)
  }

  async singUp(email: string, password: string, clientCode: string) {
    await this.repository.validateCodeClient(clientCode)
    const data = await this.repository.singUp(email, password)
    if (data) {
      await this.closeCodeClient(clientCode)
    }
    return data
  }

  async singIn(email: string, password: string) {
    return await this.repository.singIn(email, password)
  }

  async closeCodeClient(codeClient: string) {
    return await this.repository.closeCodeClient(codeClient)
  }

  async checkSession(token: string) {
    return await this.repository.checkSession(token)
  }

  async authorization(provider: string) {
    console.info('authorization', provider)
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
}
