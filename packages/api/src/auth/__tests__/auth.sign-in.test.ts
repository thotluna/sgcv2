import { repositorySignIn, signInData } from './auth.configtest'
import { apiSignInUrl, signInMock } from './auth.sign-in.test-helper'
import { app, i18n as i18nTest } from './auth.test-base'
import { buildUserMock } from './test-utils'
import { ErrorDetail } from '@api/errors/errors'
import { ApiResponse, STATUS } from '@api/types'
import {
  AUTH_ERROR,
  AuthErrorC,
  SYSTEM_ERROR,
  UserResponse,
  VALIDATION_ERROR,
} from '@auth'
import { HTTP_CODE } from '@sgcv2/shared'
import request from 'supertest'

describe('POST /signin', () => {
  test('happy past', async () => {
    signInMock.resolve({ data: buildUserMock(), error: null })
    const response = await request(app)
      .post(apiSignInUrl())
      .send(signInData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(HTTP_CODE.OK)
    const body: ApiResponse<{ data: UserResponse; error: null }> = response.body
    expect(body.status).toEqual(STATUS.SUCCESS)
    expect(body.data?.data).toEqual(buildUserMock())
    expect(body.data?.error).toBeNull()
    expect(body.message).toBeUndefined()
    expect(body.httpCode).toEqual(HTTP_CODE.OK)
    expect(body.errors).toEqual([])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })

  test('email invalid', async () => {
    const response = await request(app)
      .post(apiSignInUrl())
      .send({ ...signInData, email: 'alan.com' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(HTTP_CODE.BAD_REQUEST)
    const body: ApiResponse<undefined, ErrorDetail> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(i18nTest.t(VALIDATION_ERROR.EMAIL_INVALID))
    expect(body.httpCode).toEqual(HTTP_CODE.BAD_REQUEST)
    expect(body.errors).toEqual([
      {
        code: VALIDATION_ERROR.EMAIL_INVALID,
        message: i18nTest.t(VALIDATION_ERROR.EMAIL_INVALID),
      },
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })

  test('password invalid', async () => {
    const response = await request(app)
      .post(apiSignInUrl())
      .send({ ...signInData, password: '123' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(HTTP_CODE.BAD_REQUEST)
    const body: ApiResponse<undefined, ErrorDetail> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(
      i18nTest.t(VALIDATION_ERROR.PASSWORD_MIN_LENGTH),
    )
    expect(body.httpCode).toEqual(HTTP_CODE.BAD_REQUEST)
    expect(body.errors).toEqual([
      {
        code: VALIDATION_ERROR.PASSWORD_MIN_LENGTH,
        message: i18nTest.t(VALIDATION_ERROR.PASSWORD_MIN_LENGTH),
      },
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })

  test('credential invalid', async () => {
    repositorySignIn.reject(
      new AuthErrorC(
        AUTH_ERROR.INVALID_CREDENTIALS,
        AUTH_ERROR.INVALID_CREDENTIALS,
      ),
    )
    const response = await request(app)
      .post(apiSignInUrl())
      .send(signInData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(HTTP_CODE.UNAUTHORIZED)
    const body: ApiResponse<undefined, ErrorDetail> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(i18nTest.t(AUTH_ERROR.INVALID_CREDENTIALS))
    expect(body.httpCode).toEqual(HTTP_CODE.UNAUTHORIZED)
    expect(body.errors).toEqual([
      {
        code: AUTH_ERROR.INVALID_CREDENTIALS,
        message: i18nTest.t(AUTH_ERROR.INVALID_CREDENTIALS),
      },
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })

  test('other error', async () => {
    repositorySignIn.reject(new Error('unknown_error'))
    const response = await request(app)
      .post(apiSignInUrl())
      .send(signInData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(500)
    const body: ApiResponse<undefined, ErrorDetail> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(i18nTest.t(SYSTEM_ERROR.UNKNOWN_ERROR))
    expect(body.httpCode).toEqual(HTTP_CODE.SERVER_ERROR)
    expect(body.errors).toEqual([
      {
        code: SYSTEM_ERROR.UNKNOWN_ERROR,
        message: i18nTest.t(SYSTEM_ERROR.UNKNOWN_ERROR),
      },
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })

  test('other error', async () => {
    repositorySignIn.reject(new Error('unknown_error'))
    const response = await request(app)
      .post(apiSignInUrl())
      .send(signInData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(HTTP_CODE.SERVER_ERROR)
    const body: ApiResponse<undefined, ErrorDetail> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(i18nTest.t(SYSTEM_ERROR.UNKNOWN_ERROR))
    expect(body.httpCode).toEqual(HTTP_CODE.SERVER_ERROR)
    expect(body.errors).toEqual([
      {
        code: SYSTEM_ERROR.UNKNOWN_ERROR,
        message: i18nTest.t(SYSTEM_ERROR.UNKNOWN_ERROR),
      },
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
})
