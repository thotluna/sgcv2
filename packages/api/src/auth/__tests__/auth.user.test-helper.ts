import { authRepositoryMock } from './auth.configtest'
import { API_HOST, API_PORT } from './test-env'
import { buildUserMock } from './test-utils'
import { AuthRouter } from '@auth'

export const API_USER = AuthRouter.getAbsoluteRoutes().user

export const USER_TOKES = {
  VALID:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJleGlzdGVuQGdtYWlsLmNvbSIsImVtYWlsIjoiZXhpc3RlbkBnbWFpbC5jb20iLCJpYXQiOjE3NDYzOTk5NDgsImV4cCI6MTc3Nzk1NzU0OH0.ZuTYsQMjrlEeG8ifTgQQofnF_7JFOy4CrX8RVmEdnTo',
  EMPTY: '',
  NOT_USER:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlaXN0ZW5AZ21haWwuY29tIiwiZW1haWwiOiJlaXN0ZW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2Mzk5NDY5LCJleHAiOjE3Nzc5NTcwNjl9.IJSBo_lXAAAvW_4vdg2BPFMB0FK6FNIWU_TRboxwE30',
  MAL_FORMET:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlaXN0ZW5AZ21haWwuY29tIiwiZW1haWwiOiJlaXN0ZW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2Mzk5NDY5LCJleHAiOjE3Nzc5NTcwNjl9.IJSBo_lXAAAvW_4vdg2BPFMB0FK6FNIWU_TRboxwE3'
}

export function apiUserUrl(params: { [key: string]: any } = {}) {
  const url = new URL(`${API_HOST}:${API_PORT}${API_USER}`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.pathname + url.search
}
export const userMock = {
  resolve: (data = buildUserMock()) =>
    (authRepositoryMock.getUser as jest.Mock).mockResolvedValue(data),
  reject: (error: Error) =>
    (authRepositoryMock.getUser as jest.Mock).mockRejectedValue(error)
}
