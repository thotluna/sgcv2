import { authRepositoryMock } from './auth.configtest'
import { API_HOST, API_PORT } from './test-env'
import { buildUserMock } from './test-utils'
import { AuthRouter } from '@auth'

export const API_USER = AuthRouter.getAbsoluteRoutes().user

export function apiUserUrl(params: { [key: string]: any } = {}) {
  const url = new URL(`${API_HOST}:${API_PORT}${API_USER}`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.pathname + url.search
}

// Mock y datos específicos para el test de user, manipula el mock global inyectado
export const userMock = {
  resolve: (data = buildUserMock()) =>
    (authRepositoryMock.getUser as jest.Mock).mockResolvedValue(data),
  reject: (error: Error) =>
    (authRepositoryMock.getUser as jest.Mock).mockRejectedValue(error),
}
