import { apiSignInUrl, SIGN_IN_FROM_DATA } from './auth.sign-in.test-helper'
import { app, i18n as i18nTest } from './auth.test-base'
import { ErrorDetail } from '@api/errors/errors'
import { ApiResponse, STATUS } from '@api/types'
import { AUTH_ERROR, UserResponse, VALIDATION_ERROR } from '@auth'
import { HTTP_CODE } from '@sgcv2/shared'
import request from 'supertest'

describe('POST /signin', () => {
  test('happy past', async () => {
    const response = await request(app)
      .post(apiSignInUrl())
      .send(SIGN_IN_FROM_DATA.VALID)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(HTTP_CODE.OK)
    const body: ApiResponse<{ data: UserResponse; error: null }> = response.body
    expect(body.status).toEqual(STATUS.SUCCESS)
    expect(body.data?.error).toBeUndefined()
    expect(body.message).toBeUndefined()
    expect(body.httpCode).toEqual(HTTP_CODE.OK)
    expect(body.errors).toEqual([])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
  test('email invalid', async () => {
    const response = await request(app)
      .post(apiSignInUrl())
      .send(SIGN_IN_FROM_DATA.EMAIL_INVALID)
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
        message: i18nTest.t(VALIDATION_ERROR.EMAIL_INVALID)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
  test('password invalid', async () => {
    const response = await request(app)
      .post(apiSignInUrl())
      .send(SIGN_IN_FROM_DATA.PASSWORD_INVALID)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(HTTP_CODE.BAD_REQUEST)
    const body: ApiResponse<undefined, ErrorDetail> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(
      i18nTest.t(VALIDATION_ERROR.PASSWORD_MIN_LENGTH)
    )
    expect(body.httpCode).toEqual(HTTP_CODE.BAD_REQUEST)
    expect(body.errors).toEqual([
      {
        code: VALIDATION_ERROR.PASSWORD_MIN_LENGTH,
        message: i18nTest.t(VALIDATION_ERROR.PASSWORD_MIN_LENGTH)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
  test('credential invalid', async () => {
    const response = await request(app)
      .post(apiSignInUrl())
      .send(SIGN_IN_FROM_DATA.CREDENTIAL_INVALID)
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
        message: i18nTest.t(AUTH_ERROR.INVALID_CREDENTIALS)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
})
