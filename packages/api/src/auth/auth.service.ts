import { AuthRespository, AuthError, AUTH_ERROR } from '@auth'
import { generatePKCEParams, CustomerCodeJwtHelper } from '@utils'

export class AuthService {
  private repository: AuthRespository
  constructor(repository: AuthRespository) {
    this.repository = repository
  }
  async customerCode(email: string) {
    const { JWT_SECRET } = process.env
    const token = new CustomerCodeJwtHelper(JWT_SECRET!).crearToken(email)
    return await this.repository.saveCustomerCode(token, email)
  }
  async validateCustomerCode(code: string) {
    const { SECRET } = process.env
    new CustomerCodeJwtHelper(SECRET!).verificarToken(code)
    return await this.repository.validateCustomerCode(code)
  }
  async signUp(email: string, password: string, code: string) {
    const { SECRET } = process.env
    const payload = new CustomerCodeJwtHelper(SECRET!).verificarToken(code)
    if (payload.email !== email) {
      throw new AuthError({
        code: AUTH_ERROR.INVALID_CODE,
        message: AUTH_ERROR.INVALID_CODE
      })
    }
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
    const { API_HOST, PORT } = process.env
    const data: Record<string, string> = {
      provider,
      redirect_to: `${API_HOST}:${PORT}/v1/auth/callback`,
      code_challenge: PKCEPparams.codeChallenge,
      code_challenge_method: 'S256'
    }
    return { data, codeVerifier: PKCEPparams.codeVerifier }
  }
  async callback(code: string, codeVerifier: string) {
    return await this.repository.callback(code, codeVerifier)
  }
  async getUser(access_token: string) {
    const user = await this.repository.getUser(access_token)
    if (!user.user) {
      throw new AuthError({
        code: AUTH_ERROR.TOKEN_INVALID,
        message: AUTH_ERROR.TOKEN_INVALID
      })
    }
    return user
  }

  resetMock() {
    this.repository.resetMock()
    return
  }
}
