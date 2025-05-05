import { AuthRespository, UserResponse } from '@auth'
import { AuthRouter } from '@auth'

export const authRepositoryMock: AuthRespository = {
  saveCustomerCode: jest.fn(),
  validateCustomerCode: jest.fn(),
  signUp: jest.fn(),
  signIn: jest.fn(),
  closeCustomerCode: jest.fn(),
  callback: jest.fn(),
  getUser: jest.fn(),
  resetMock: jest.fn()
}

export const data = {
  user: {
    id: '123456789',
    email: 'alan@gmail.com',
    created_at: Date.now(),
    role: 'authenticated'
  },
  session: {
    provider_token: 'password'
  }
}

export const repositoryCallback = {
  resolve: () =>
    (authRepositoryMock.callback as jest.Mock).mockResolvedValue({
      access_token: '123456789',
      expires_at: Date.now(),
      refresh_token: '123456789'
    }),
  reject: (error: Error) =>
    (authRepositoryMock.callback as jest.Mock).mockRejectedValue(error)
}

export const dataUser: UserResponse = {
  user: {
    id: '123456789',
    email: 'alan@gmail.com',
    created_at: Date.now() + '',
    role: 'authenticated'
  },
  session: {
    access_token:
      'eyJhbGciOiJIUzI1NiIsImtpZCI6Im1YWlA5N3FRSkhPRkI4ckMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3J6ZnZ6cWhjZWFocXBqempzd3h6LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzY2RmOGY3MC0yNjc2LTQ5ZGMtOWZkYS0xNTFkNTg5YTkxNWEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ1ODkxNDg3LCJpYXQiOjE3NDU4ODc4ODcsImVtYWlsIjoidGhvdGx1bmFAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6InRob3RsdW5hQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjNjZGY4ZjcwLTI2NzYtNDlkYy05ZmRhLTE1MWQ1ODlhOTE1YSJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzQ1ODg3ODg3fV0sInNlc3Npb25faWQiOiJjYzkxZGFiOC04YzI3LTRlYTUtYTRhOS01NDBhMTYzNTkwMGQiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.aYuZrgqRcdTfuaZjtQm7S-vzPzuqmV3OvCXoBKb_KLE',
    expires_at: Date.now(),
    expires_in: 3600,
    refresh_token: '123456789',
    token_type: 'Bearer',
    user: {
      id: '123456789',
      email: 'alan@gmail.com',
      created_at: Date.now() + '',
      role: 'authenticated'
    }
  }
}

export const repositoryUser = {
  resolve: (data?: UserResponse | undefined) =>
    (authRepositoryMock.getUser as jest.Mock).mockResolvedValue(
      data ? data : dataUser
    ),
  reject: (error: Error) =>
    (authRepositoryMock.getUser as jest.Mock).mockRejectedValue(error)
}

export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost'
export const PORT_FRONTEND = process.env.PORT_FRONTEND || '3000'

export const ROUTE_FRONTEND_REGISTER = `${FRONTEND_URL}:${PORT_FRONTEND}/register`
export const ROUTE_FRONTEND_CALLBACK = `${FRONTEND_URL}:${PORT_FRONTEND}/auth/callback`

export const API_CALLBACK = AuthRouter.getAbsoluteRoutes().callback
export function apiCallbackWithCode(code: string) {
  return `${API_CALLBACK}?code=${code}`
}
