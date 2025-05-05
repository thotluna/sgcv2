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
export const signUpMock = {
  resolve: (data = buildUserMock()) =>
    (authRepositoryMock.signUp as jest.Mock).mockResolvedValue(data),
  reject: (error: Error) =>
    (authRepositoryMock.signUp as jest.Mock).mockRejectedValue(error)
}

export const SIGN_UP_FROM_DATA = {
  USER_EXIST: {
    code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImV4aXN0ZW5AZ21haWwuY29tIiwiZW1haWwiOiJleGlzdGVuQGdtYWlsLmNvbSIsImlhdCI6MTc0NjM5MzkwMCwiZXhwIjoxNzc3OTUxNTAwfQ.GGXWbelQAimIPdnU8PQBrhiKXCo0mmlO9j5CeXrKDts',
    email: 'existen@gmail.com',
    password: '123456789'
  },
  USER_NEW: {
    code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im5ld0BnbWFpbC5jb20iLCJlbWFpbCI6Im5ld0BnbWFpbC5jb20iLCJpYXQiOjE3NDYzOTM5NjksImV4cCI6MTc3Nzk1MTU2OX0.8cwDEHFS4w92L9ckeOf1ql3IeI0-2WsEa0x8M1NILD0',
    email: 'new@gmail.com',
    password: '123456789'
  },
  USER_CODE_INVALID: {
    code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im5ld0BnbWFpbC5jb20iLCJlbWFpbCI6Im5ld0BnbWFpbC5jb20iLCJpYXQiOjE3NDYzOTQ4MjEsImV4cCI6MTc3Nzk1MjQyMX0.TzZ_qUppFsVLJMv5VqHGOgICwS3czdr3wj_UYAVbrUA',
    email: 'new@gmail.com',
    password: '123456789'
  }
}
