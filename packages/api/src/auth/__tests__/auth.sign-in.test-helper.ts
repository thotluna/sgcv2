import { authRepositoryMock } from './auth.configtest'
import { API_HOST, API_PORT } from './test-env'
import { buildUserMock } from './test-utils'
import { AuthRouter } from '@auth'

export const API_SIGNIN = AuthRouter.getAbsoluteRoutes().signIn
export function apiSignInUrl(params: { [key: string]: any } = {}) {
  const url = new URL(`${API_HOST}:${API_PORT}${API_SIGNIN}`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.pathname + url.search
}
export const signInMock = {
  resolve: (data = { data: buildUserMock(), error: null }) =>
    (authRepositoryMock.signIn as jest.Mock).mockResolvedValue(data),
  reject: (error: Error) =>
    (authRepositoryMock.signIn as jest.Mock).mockRejectedValue(error),
}
