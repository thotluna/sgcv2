import { repositoryUser } from './auth.configtest'
import { app, i18n as i18nTest } from './auth.test-base'
import { apiUserUrl, USER_TOKES } from './auth.user.test-helper'
import { ErrorDetail } from '@api/errors/errors'
import { ApiResponse, STATUS } from '@api/types'
import { AUTH_ERROR } from '@auth/errors'
import { UserResponse } from '@auth/types'
import { HTTP_CODE } from '@sgcv2/shared'
import request from 'supertest'

describe('GET /user', () => {
  test('happy past', async () => {
    repositoryUser.resolve()
    const response = await request(app)
      .get(apiUserUrl())
      .set('Accept', 'application/json')
      .set('Authorization', `Beare ${USER_TOKES.VALID}`)
    expect(response.status).toBe(HTTP_CODE.OK)
    const body: ApiResponse<UserResponse> = response.body
    expect(body.status).toEqual(STATUS.SUCCESS)
    expect(body.data?.user).not.toBeUndefined()
    expect(body.message).toBeUndefined()
    expect(body.httpCode).toEqual(HTTP_CODE.OK)
    expect(body.errors).toEqual([])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
  test('without token', async () => {
    const response = await request(app)
      .get(apiUserUrl())
      .set('Accept', 'application/json')
    expect(response.status).toBe(HTTP_CODE.UNAUTHORIZED)
    const body: ApiResponse<UserResponse, ErrorDetail> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(i18nTest.t(AUTH_ERROR.TOKEN_REQUIRED))
    expect(body.httpCode).toEqual(HTTP_CODE.UNAUTHORIZED)
    expect(body.errors).toEqual([
      {
        code: AUTH_ERROR.TOKEN_REQUIRED,
        message: i18nTest.t(AUTH_ERROR.TOKEN_REQUIRED)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
  test('with empty bearer', async () => {
    const response = await request(app)
      .get(apiUserUrl())
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Beare ${USER_TOKES.EMPTY}`)
    expect(response.status).toBe(HTTP_CODE.UNAUTHORIZED)
    const body: ApiResponse<UserResponse, ErrorDetail> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(i18nTest.t(AUTH_ERROR.TOKEN_MALFORMED))
    expect(body.httpCode).toEqual(HTTP_CODE.UNAUTHORIZED)
    expect(body.errors).toEqual([
      {
        code: AUTH_ERROR.TOKEN_INVALID,
        message: i18nTest.t(AUTH_ERROR.TOKEN_MALFORMED)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
  test('token do not return user', async () => {
    const response = await request(app)
      .get(apiUserUrl())
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Beare ${USER_TOKES.NOT_USER}`)
    expect(response.status).toBe(HTTP_CODE.UNAUTHORIZED)
    const body: ApiResponse<UserResponse, ErrorDetail> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(i18nTest.t(AUTH_ERROR.TOKEN_INVALID))
    expect(body.httpCode).toEqual(HTTP_CODE.UNAUTHORIZED)
    expect(body.errors).toEqual([
      {
        code: AUTH_ERROR.TOKEN_INVALID,
        message: i18nTest.t(AUTH_ERROR.TOKEN_INVALID)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
  test('token malformed', async () => {
    const response = await request(app)
      .get(apiUserUrl())
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${USER_TOKES.MAL_FORMET}`)
    expect(response.status).toBe(HTTP_CODE.UNAUTHORIZED)
    const body: ApiResponse<UserResponse, ErrorDetail> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(i18nTest.t(AUTH_ERROR.TOKEN_MALFORMED))
    expect(body.httpCode).toEqual(HTTP_CODE.UNAUTHORIZED)
    expect(body.errors).toEqual([
      {
        code: AUTH_ERROR.TOKEN_INVALID,
        message: i18nTest.t(AUTH_ERROR.TOKEN_MALFORMED)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
})
