import { AuthRespository, AuthErrorC, AUTH_ERROR } from '@auth'
import { generatePKCEParams, CustomerCodeJwtHelper } from '@utils'

export class AuthService {
  private repository: AuthRespository

  constructor(repository: AuthRespository) {
    this.repository = repository
  }

  async customerCode(email: string) {
    const { SECRET } = process.env
    const token = new CustomerCodeJwtHelper(SECRET!).crearToken(email)

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
      throw new AuthErrorC(AUTH_ERROR.INVALID_CODE, AUTH_ERROR.INVALID_CODE)
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

    const { FRONTEND_URL, PORT_FRONTEND, FRONTEND_CALLBACK } = process.env

    const data: Record<string, string> = {
      provider,
      redirect_to: `${FRONTEND_URL}:${PORT_FRONTEND}${FRONTEND_CALLBACK}`,
      code_challenge: PKCEPparams.codeChallenge,
      code_challenge_method: 'S256',
    }

    return { data, codeVerifier: PKCEPparams.codeVerifier }
  }

  async callback(code: string, codeVerifier: string) {
    return await this.repository.callback(code, codeVerifier)
  }

  async getUser(access_token: string) {
    const user = await this.repository.getUser(access_token)
    if (!user.user) {
      throw new AuthErrorC(AUTH_ERROR.TOKEN_INVALID, AUTH_ERROR.TOKEN_INVALID)
    }
    return user
  }
}
