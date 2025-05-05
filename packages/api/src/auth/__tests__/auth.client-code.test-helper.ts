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
export const clientCodeMock = {
  resolve: (data = buildUserMock()) =>
    (authRepositoryMock.validateCustomerCode as jest.Mock).mockResolvedValue(
      data
    ),
  reject: (error: Error) =>
    (authRepositoryMock.validateCustomerCode as jest.Mock).mockRejectedValue(
      error
    )
}

export const CLIENT_CODE_FROM_DATA = {
  VALID: {
    email: 'new@gmail.com',
    code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im5ld0BnbWFpbC5jb20iLCJlbWFpbCI6Im5ld0BnbWFpbC5jb20iLCJpYXQiOjE3NDYzOTM5NjksImV4cCI6MTc3Nzk1MTU2OX0.8cwDEHFS4w92L9ckeOf1ql3IeI0-2WsEa0x8M1NILD0'
  },
  REFUSED: {
    email: 'new@gmail.com',
    code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im5ld0BnbWFpbC5jb20iLCJlbWFpbCI6Im5ld0BnbWFpbC5jb20iLCJpYXQiOjE3NDYzOTQ4MjEsImV4cCI6MTc3Nzk1MjQyMX0.TzZ_qUppFsVLJMv5VqHGOgICwS3czdr3wj_UYAVbrUA'
  }
}
