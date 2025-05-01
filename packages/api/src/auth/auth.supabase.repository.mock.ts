import type { CallbackResult, User, UserResponse } from '@auth'
import { AUTH_ERROR, AuthErrorC, AuthRespository } from '@auth'
import { CustomerCodeJwtHelper } from '@utils'

export class SupabaseAuthRepositoryMock implements AuthRespository {
  private mockData: {
    customerCodes: Array<{
      code: string
      email: string
      created_at: string
      claimed: boolean
    }>
    users: Array<{ id: string; email: string; password?: string }>
    usersTull: Array<User>
  } = {
    customerCodes: [],
    users: [],
    usersTull: [],
  }

  saveCustomerCode = async (token: string, email: string) => {
    const newCode = {
      code: token,
      email,
      created_at: new Date().toISOString(),
      claimed: false,
    }
    this.mockData.customerCodes.push(newCode)
    return [newCode]
  }

  validateCustomerCode = async (code: string): Promise<boolean> => {
    const customerCode = this.mockData.customerCodes.find(
      item => item.code === code && !item.claimed,
    )

    return !!customerCode
  }

  signUp = async (email: string, password: string): Promise<UserResponse> => {
    const existingUser = this.mockData.users.find(user => user.email === email)
    if (existingUser) {
      throw new AuthErrorC(
        AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
        AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
      )
    }

    const result = this.getUserResponse(email)
    this.mockData.users.push({ id: result.user!.id, email, password })
    this.mockData.usersTull.push(result.user!)
    return result
  }

  signIn = async (email: string, password: string): Promise<UserResponse> => {
    const user = this.mockData.users.find(
      u => u.email === email && u.password === password,
    )

    const userFull = this.mockData.usersTull.find(user => user.email === email)

    if (!user || !userFull) {
      throw new AuthErrorC(
        AUTH_ERROR.INVALID_CREDENTIALS,
        AUTH_ERROR.INVALID_CREDENTIALS,
      )
    }

    return {
      user: userFull,
      session: this.getUserResponse(userFull.email!).session,
    }
  }

  private getUserResponse = (email: string): UserResponse => {
    const now = new Date()
    const utcTimestamp = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds(),
      ),
    )

    const user: User = {
      id: `mock-user-${this.mockData.users.length + 1}`,
      email,
      created_at: utcTimestamp.toISOString(),
      role: 'authentificated',
    }
    return {
      user,
      session: {
        provider_token: 'google',
        provider_refresh_token: 'asdasdoalskdasdaksdas',
        access_token: new CustomerCodeJwtHelper(
          process.env.JWT_SECRET!,
        ).crearToken(email),
        refresh_token: new CustomerCodeJwtHelper(
          process.env.JWT_SECRET!,
        ).crearToken(email),
        expires_in: Date.now() + 24 * 60 * 60 * 1000,
        expires_at: 24 * 60 * 60 * 1000,
        token_type: 'JWT',
        user,
      },
    }
  }

  // Método adicional para limpiar el estado del mock entre pruebas
  resetMockData() {
    this.mockData = {
      customerCodes: [],
      users: [],
      usersTull: [],
    }
  }

  getUser = async (access_token: string): Promise<UserResponse> => {
    const decode = new CustomerCodeJwtHelper(
      process.env.JWT_SECRET!,
    ).getPayload(access_token)
    // Simular obtención de usuario basado en un token de acceso
    const user = this.mockData.users.find(u => u.email === decode?.email)
    if (!user) {
      throw new AuthErrorC(
        AUTH_ERROR.NOT_FOUND_ANONYMOUS_KEY,
        AUTH_ERROR.NOT_FOUND_ANONYMOUS_KEY,
      )
    }
    return {
      user: {
        id: user.id,
        email: user.email,
        created_at: new Date().toISOString(),
      },
      session: this.getUserResponse(user.email).session,
    }
  }

  closeCustomerCode = async (code: string): Promise<boolean> => {
    const customerCodeIndex = this.mockData.customerCodes.findIndex(
      item => item.code === code && !item.claimed,
    )

    if (customerCodeIndex === -1) {
      return false
    }

    this.mockData.customerCodes[customerCodeIndex].claimed = true
    return true
  }

  callback = async (
    code: string,
    codeVerifier: string,
  ): Promise<CallbackResult> => {
    // Simular un callback de OAuth
    // Usar codeVerifier para mayor realismo, aunque no se requiera en este mock
    return {
      access_token: `mock-access-token-${code}-${codeVerifier}`,
      expires_at: Date.now() + 3600 * 1000, // 1 hora desde ahora
      refresh_token: `mock-refresh-token-${code}`,
    }
  }
}
