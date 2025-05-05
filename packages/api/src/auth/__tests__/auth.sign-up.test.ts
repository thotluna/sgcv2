import { apiSignUpUrl, SIGN_UP_FROM_DATA } from './auth.sign-up.test-helper'
import { app, i18n as i18nInstance } from './auth.test-base'
import { BaseError, ErrorDetail } from '@api/errors/errors'
import { ApiResponse, STATUS } from '@api/types'
import { AUTH_ERROR, UserResponse, VALIDATION_ERROR } from '@auth'
import { HTTP_CODE } from '@sgcv2/shared'
import request from 'supertest'

describe('POST /signup', () => {
  test('happy past', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send(SIGN_UP_FROM_DATA.USER_NEW)
      .set('Accept', 'application/json')
    const body: ApiResponse<UserResponse> = response.body
    expect(body.message).toBeUndefined()
    expect(response.status).toBe(HTTP_CODE.CREATED)
    expect(body.status).toEqual(STATUS.SUCCESS)
    expect(body.httpCode).toEqual(HTTP_CODE.CREATED)
    expect(body.errors).toEqual([])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
  test('bad request, password invalid format', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send({ ...SIGN_UP_FROM_DATA.USER_NEW, password: '123' })
      .set('Accept', 'application/json')
    expect(response.status).toBe(HTTP_CODE.BAD_REQUEST)
    const body: ApiResponse<{ data: UserResponse; error: null }> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data?.data).toBeUndefined()
    expect(body.message).toEqual(
      i18nInstance.t(VALIDATION_ERROR.PASSWORD_MIN_LENGTH)
    )
    expect(body.httpCode).toEqual(HTTP_CODE.BAD_REQUEST)
    expect(body.errors).toEqual([
      {
        code: VALIDATION_ERROR.PASSWORD_MIN_LENGTH,
        message: i18nInstance.t(VALIDATION_ERROR.PASSWORD_MIN_LENGTH)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
  test('bad request, email invalid format', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send({ ...SIGN_UP_FROM_DATA.USER_NEW, email: 'alan.com' })
      .set('Accept', 'application/json')
    expect(response.status).toBe(HTTP_CODE.BAD_REQUEST)
    const body: ApiResponse<{ data: UserResponse; error: null }> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data?.data).toBeUndefined()
    expect(body.message).toEqual(i18nInstance.t(VALIDATION_ERROR.EMAIL_INVALID))
    expect(body.httpCode).toEqual(HTTP_CODE.BAD_REQUEST)
    expect(body.errors).toEqual([
      {
        code: VALIDATION_ERROR.EMAIL_INVALID,
        message: i18nInstance.t(VALIDATION_ERROR.EMAIL_INVALID)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
  test('bad request, code client invalid format', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send({ ...SIGN_UP_FROM_DATA.USER_NEW, code: '123' })
      .set('Accept', 'application/json')
    expect(response.status).toBe(HTTP_CODE.UNAUTHORIZED)
    const body: ApiResponse<UserResponse, ErrorDetail> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(i18nInstance.t(AUTH_ERROR.TOKEN_MALFORMED))
    expect(body.httpCode).toEqual(HTTP_CODE.UNAUTHORIZED)
    expect(body.errors).toEqual([
      {
        code: AUTH_ERROR.TOKEN_INVALID,
        message: i18nInstance.t(AUTH_ERROR.TOKEN_MALFORMED)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
  test('error, code client refused', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send(SIGN_UP_FROM_DATA.USER_CODE_INVALID)
      .set('Accept', 'application/json')
    expect(response.status).toBe(HTTP_CODE.UNAUTHORIZED)
    const body: ApiResponse<UserResponse, ErrorDetail> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(i18nInstance.t(AUTH_ERROR.CODE_NOT_FOUND))
    expect(body.httpCode).toEqual(HTTP_CODE.UNAUTHORIZED)
    expect(body.errors).toEqual([
      {
        code: AUTH_ERROR.CODE_NOT_FOUND,
        message: i18nInstance.t(AUTH_ERROR.CODE_NOT_FOUND)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
  test('error, email registered', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send(SIGN_UP_FROM_DATA.USER_EXIST)
      .set('Accept', 'application/json')
    expect(response.status).toBe(HTTP_CODE.UNAUTHORIZED)
    const body: ApiResponse<undefined, BaseError> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(
      i18nInstance.t(AUTH_ERROR.EMAIL_ALREADY_REGISTERED)
    )
    expect(body.httpCode).toEqual(HTTP_CODE.UNAUTHORIZED)
    expect(body.errors).toEqual([
      {
        code: AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
        message: i18nInstance.t(AUTH_ERROR.EMAIL_ALREADY_REGISTERED)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
})
