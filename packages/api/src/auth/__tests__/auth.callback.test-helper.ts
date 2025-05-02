import { authRepositoryMock } from './auth.configtest'
import { API_HOST, API_PORT, FRONTEND_URL, PORT_FRONTEND } from './test-env'
import { buildUserMock } from './test-utils'
import { AuthRouter } from '@auth'

export const API_CALLBACK = AuthRouter.getAbsoluteRoutes().callback
export const ROUTE_FRONTEND_REGISTER = `${FRONTEND_URL}:${PORT_FRONTEND}/register`
export const ROUTE_FRONTEND_CALLBACK = `${FRONTEND_URL}:${PORT_FRONTEND}/auth/callback`
export function apiCallbackWithCode(code: string) {
  const url = new URL(`${API_HOST}:${API_PORT}${API_CALLBACK}`)
  url.searchParams.set('code', code)
  return url.pathname + url.search
}
export const callbackMock = {
  resolve: (data = buildUserMock()) =>
    (authRepositoryMock.callback as jest.Mock).mockResolvedValue(data),
  reject: (error: Error) =>
    (authRepositoryMock.callback as jest.Mock).mockRejectedValue(error),
}
