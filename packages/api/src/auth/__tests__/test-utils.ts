import { UserResponse } from '@auth'

/**
 * Genera un mock de respuesta de usuario para los tests.
 * Permite sobreescribir cualquier campo por defecto con tipado estricto.
 * Para evitar inconsistencias en los tests, los timestamps están hardcodeados.
 */
export function buildUserMock(
  overrides: Partial<UserResponse> = {}
): UserResponse {
  const fixedTimestamp = '1745867632973'
  const baseUser = {
    id: '123456789',
    email: 'alan@gmail.com',
    created_at: fixedTimestamp,
    role: 'authenticated'
  }
  const mock: UserResponse = {
    user: { ...baseUser, ...(overrides.user || {}) },
    session: {
      access_token: '123456789',
      expires_at: Number(fixedTimestamp),
      expires_in: 3600,
      refresh_token: '123456789',
      token_type: 'Bearer',
      user: { ...baseUser, ...(overrides.session?.user || {}) },
      ...(overrides.session || {})
    },
    ...overrides
  }
  return mock
}
