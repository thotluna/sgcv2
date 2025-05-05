import type { CallbackResult, User, UserResponse } from '@auth'
import { AUTH_ERROR, AuthError, AuthRespository } from '@auth'
import { CustomerCodeJwtHelper } from '@utils'

export class AuthMockRepository implements AuthRespository {
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
    customerCodes: [
      {
        code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImV4aXN0ZW5AZ21haWwuY29tIiwiZW1haWwiOiJleGlzdGVuQGdtYWlsLmNvbSIsImlhdCI6MTc0NjM5MzkwMCwiZXhwIjoxNzc3OTUxNTAwfQ.GGXWbelQAimIPdnU8PQBrhiKXCo0mmlO9j5CeXrKDts',
        email: 'existen@gmail.com',
        created_at: '2025-05-04T21:25:00.931Z',
        claimed: false
      },
      {
        code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im5ld0BnbWFpbC5jb20iLCJlbWFpbCI6Im5ld0BnbWFpbC5jb20iLCJpYXQiOjE3NDYzOTM5NjksImV4cCI6MTc3Nzk1MTU2OX0.8cwDEHFS4w92L9ckeOf1ql3IeI0-2WsEa0x8M1NILD0',
        email: 'new@gmail.com',
        created_at: '2025-05-04T21:26:09.848Z',
        claimed: false
      }
    ],
    users: [
      {
        id: '123456789',
        email: 'existen@gmail.com',
        password: '123456789'
      }
    ],
    usersTull: [
      {
        id: '123456789',
        email: 'existen@gmail.com',
        created_at: '1745867632973',
        role: 'authenticated'
      },
      {
        id: '123456789',
        email: 'new@gmail.com',
        created_at: '1745867632973',
        role: 'authenticated'
      }
    ]
  }
  saveCustomerCode = async (token: string, email: string) => {
    const newCode = {
      code: token,
      email,
      created_at: new Date().toISOString(),
      claimed: false
    }
    this.mockData.customerCodes.push(newCode)
    return [newCode]
  }
  validateCustomerCode = async (code: string): Promise<boolean> => {
    const customerCode = this.mockData.customerCodes.find(
      item => item.code === code && !item.claimed
    )
    if (!customerCode) {
      throw new AuthError({
        code: AUTH_ERROR.CODE_NOT_FOUND,
        message: AUTH_ERROR.CODE_NOT_FOUND,
        details: {
          message: 'any error from supabase',
          timestamp: Date.now()
        }
      })
    }

    return !!customerCode
  }
  signUp = async (email: string, password: string): Promise<UserResponse> => {
    const existingUser = this.mockData.users.find(user => user.email === email)
    if (existingUser) {
      throw new AuthError({
        code: AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
        message: AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
        details: {
          message: AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
          timestamp: Date.now()
        }
      })
    }
    const result = this.getUserResponse(email)
    this.mockData.users.push({ id: result.user!.id, email, password })
    this.mockData.usersTull.push(result.user!)
    return result
  }
  signIn = async (email: string, password: string): Promise<UserResponse> => {
    const user = this.mockData.users.find(
      u => u.email === email && u.password === password
    )
    const userFull = this.mockData.usersTull.find(user => user.email === email)
    if (!user || !userFull) {
      throw new AuthError({
        code: AUTH_ERROR.INVALID_CREDENTIALS,
        message: AUTH_ERROR.INVALID_CREDENTIALS
      })
    }
    return {
      user: userFull,
      session: this.getUserResponse(userFull.email!).session
    }
  }
  private getUserResponse = (email: string): UserResponse => {
    const user: User = {
      id: `123456789`,
      email,
      created_at: '1745867632973',
      role: 'authenticated'
    }
    return {
      user,
      session: {
        provider_token: 'google',
        provider_refresh_token: 'asdasdoalskdasdaksdas',
        access_token: new CustomerCodeJwtHelper(
          process.env.JWT_SECRET!
        ).crearToken(email),
        refresh_token: new CustomerCodeJwtHelper(
          process.env.JWT_SECRET!
        ).crearToken(email),
        expires_in: Date.now() + 24 * 60 * 60 * 1000,
        expires_at: 24 * 60 * 60 * 1000,
        token_type: 'JWT',
        user
      }
    }
  }

  getUser = async (access_token: string): Promise<UserResponse> => {
    const decode = new CustomerCodeJwtHelper(
      process.env.JWT_SECRET!
    ).getPayload(access_token)

    const user = this.mockData.users.find(u => u.email === decode?.email)
    if (!user) {
      throw new AuthError({
        code: AUTH_ERROR.TOKEN_INVALID,
        message: AUTH_ERROR.TOKEN_INVALID
      })
    }
    return {
      user: {
        id: user.id,
        email: user.email,
        created_at: new Date().toISOString()
      },
      session: this.getUserResponse(user.email).session
    }
  }
  closeCustomerCode = async (code: string): Promise<boolean> => {
    const customerCodeIndex = this.mockData.customerCodes.findIndex(
      item => item.code === code && !item.claimed
    )
    if (customerCodeIndex === -1) {
      return false
    }
    this.mockData.customerCodes[customerCodeIndex].claimed = true
    return true
  }
  callback = async (
    code: string,
    codeVerifier: string
  ): Promise<CallbackResult> => {
    return {
      access_token: `mock-access-token-${code}-${codeVerifier}`,
      expires_at: Date.now() + 3600 * 1000,
      refresh_token: `mock-refresh-token-${code}`
    }
  }

  async resetMock() {
    this.mockData = {
      customerCodes: [
        {
          code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImV4aXN0ZW5AZ21haWwuY29tIiwiZW1haWwiOiJleGlzdGVuQGdtYWlsLmNvbSIsImlhdCI6MTc0NjM5MzkwMCwiZXhwIjoxNzc3OTUxNTAwfQ.GGXWbelQAimIPdnU8PQBrhiKXCo0mmlO9j5CeXrKDts',
          email: 'existen@gmail.com',
          created_at: '2025-05-04T21:25:00.931Z',
          claimed: false
        },
        {
          code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im5ld0BnbWFpbC5jb20iLCJlbWFpbCI6Im5ld0BnbWFpbC5jb20iLCJpYXQiOjE3NDYzOTM5NjksImV4cCI6MTc3Nzk1MTU2OX0.8cwDEHFS4w92L9ckeOf1ql3IeI0-2WsEa0x8M1NILD0',
          email: 'new@gmail.com',
          created_at: '2025-05-04T21:26:09.848Z',
          claimed: false
        }
      ],
      users: [
        {
          id: '123456789',
          email: 'existen@gmail.com',
          password: '123456789'
        }
      ],
      usersTull: [
        {
          id: '123456789',
          email: 'existen@gmail.com',
          created_at: '1745867632973',
          role: 'authenticated'
        },
        {
          id: '123456789',
          email: 'new@gmail.com',
          created_at: '1745867632973',
          role: 'authenticated'
        }
      ]
    }

    return
  }
}
