import { API_HOST, API_PORT } from './test-env'
import { AuthRouter } from '@auth'

export const API_AUTHORIZE = AuthRouter.getAbsoluteRoutes().authorize
export const PROVIDER_GOOGLE = 'google'
export const PROVIDER_INVALID = 'invalid'
export const EXPECTED_PATHNAME = '/auth/v1/authorize'
export const EXPECTED_CODE_CHALLENGE_METHOD = 'S256'

export function apiAuthorizeUrl(params: {
  provider: string
  [key: string]: any
}) {
  const url = new URL(`${API_HOST}:${API_PORT}${API_AUTHORIZE}`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.pathname + url.search
}
