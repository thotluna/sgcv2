import { authRepositoryMock } from './auth.configtest'
import { API_HOST, API_PORT } from './test-env'
import { buildUserMock } from './test-utils'
import { AuthRouter } from '@auth'

export const API_CODE_VALIDATE = AuthRouter.getAbsoluteRoutes().validateCode
export function apiClientCodeUrl(params: { [key: string]: any } = {}) {
  const url = new URL(`${API_HOST}:${API_PORT}${API_CODE_VALIDATE}`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.pathname + url.search
}

// Mock y datos específicos para el test de client code, manipula el mock global inyectado
export const clientCodeMock = {
  resolve: (data = buildUserMock()) =>
    (authRepositoryMock.validateCustomerCode as jest.Mock).mockResolvedValue(
      data,
    ),
  reject: (error: Error) =>
    (authRepositoryMock.validateCustomerCode as jest.Mock).mockRejectedValue(
      error,
    ),
}
