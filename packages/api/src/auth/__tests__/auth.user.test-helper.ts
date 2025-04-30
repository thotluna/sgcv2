import { authRepositoryMock } from './auth.configtest'
import { API_HOST, API_PORT } from './test-env'
import { buildUserMock } from './test-utils'
import { AuthRouter } from '@auth'
import { CustomerCodeJwtHelper } from '@utils'

export const API_USER = AuthRouter.getAbsoluteRoutes().user

export const TypeTokens = {
  OK: 'OK',
  EXPIRED: 'EXPIRED',
  MAL_FORMAT: 'MAL_FORMAT',
  EMPTY: 'EMPTY',
} as const

export type TypeTokenKey = keyof typeof TypeTokens

export const getToken = (type: TypeTokenKey) => {
  const { JWT_SECRET } = process.env
  if (type === TypeTokens.OK) {
    const token = new CustomerCodeJwtHelper(JWT_SECRET!).crearToken('xc@xc.xc')
    return token
  }
  if (type === TypeTokens.EXPIRED)
    return new CustomerCodeJwtHelper(JWT_SECRET!).crearToken('xc@xc.xc', 1)

  if (type === TypeTokens.MAL_FORMAT) return '12asd123asd32asd'

  if (type === TypeTokens.EMPTY) return ''

  return ''
}

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
