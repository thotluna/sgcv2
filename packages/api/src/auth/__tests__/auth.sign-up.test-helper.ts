import { authRepositoryMock } from './auth.configtest'
import { API_HOST, API_PORT, FRONTEND_URL, PORT_FRONTEND } from './test-env'
import { buildUserMock } from './test-utils'
import { AuthRouter } from '@auth'

export const API_SIGNUP = AuthRouter.getAbsoluteRoutes().signUp
export const ROUTE_FRONTEND_REGISTER = `${FRONTEND_URL}:${PORT_FRONTEND}/register`

export function apiSignUpUrl(params: { [key: string]: any } = {}) {
  const url = new URL(`${API_HOST}:${API_PORT}${API_SIGNUP}`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.pathname + url.search
}

// Mock y datos específicos para el test de sign-up, manipula el mock global inyectado
export const signUpMock = {
  resolve: (data = buildUserMock()) =>
    (authRepositoryMock.signUp as jest.Mock).mockResolvedValue(data),
  reject: (error: Error) =>
    (authRepositoryMock.signUp as jest.Mock).mockRejectedValue(error),
}
