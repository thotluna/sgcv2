import {
  repositorySignUp,
  repositoryValidateCode,
  signupData,
} from './auth.configtest'
import { apiSignUpUrl, signUpMock } from './auth.sign-up.test-helper'
import { app, i18n as i18nInstance } from './auth.test-base'
import { buildUserMock } from './test-utils'
import { ApiResponse, STATUS } from '@api/types'
import {
  AUTH_ERROR,
  AuthErrorC,
  SYSTEM_ERROR,
  SystemError,
  UserResponse,
  VALIDATION_ERROR,
} from '@auth'
import { BaseError, ErrorDetail, HTTP_CODE } from '@sgcv2/shared'
import request from 'supertest'

describe('POST /signup', () => {
  test('happy past', async () => {
    repositoryValidateCode.resolve()
    signUpMock.resolve(buildUserMock())
    const response = await request(app)
      .post(apiSignUpUrl())
      .send(signupData)
      .set('Accept', 'application/json')
    expect(response.status).toBe(HTTP_CODE.OK)
    const body: ApiResponse<UserResponse> = response.body
    expect(body.status).toEqual(STATUS.SUCCESS)
    expect(body.data?.user).toEqual(buildUserMock().user)
    expect(body.message).toBeUndefined()
    expect(body.httpCode).toEqual(HTTP_CODE.OK)
    expect(body.errors).toEqual([])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })

  test('bad request, password invalid format', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send({ ...signupData, password: '123' })
      .set('Accept', 'application/json')
    expect(response.status).toBe(HTTP_CODE.BAD_REQUEST)
    const body: ApiResponse<{ data: UserResponse; error: null }> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data?.data).toBeUndefined()
    expect(body.message).toEqual(
      i18nInstance.t(VALIDATION_ERROR.PASSWORD_MIN_LENGTH),
    )
    expect(body.httpCode).toEqual(HTTP_CODE.BAD_REQUEST)
    expect(body.errors).toEqual([
      {
        code: VALIDATION_ERROR.PASSWORD_MIN_LENGTH,
        message: i18nInstance.t(VALIDATION_ERROR.PASSWORD_MIN_LENGTH),
      },
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })

  test('bad request, email invalid format', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send({ ...signupData, email: 'alan.com' })
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
        message: i18nInstance.t(VALIDATION_ERROR.EMAIL_INVALID),
      },
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })

  test('bad request, code client invalid format', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send({ ...signupData, code: '123' })
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
        message: i18nInstance.t(AUTH_ERROR.TOKEN_MALFORMED),
      },
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })

  test('error, code client refused', async () => {
    repositoryValidateCode.reject(
      new AuthErrorC(AUTH_ERROR.CODE_NOT_FOUND, AUTH_ERROR.CODE_NOT_FOUND),
    )
    const response = await request(app)
      .post(apiSignUpUrl())
      .send(signupData)
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
        message: i18nInstance.t(AUTH_ERROR.CODE_NOT_FOUND),
      },
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })

  test('error, any other', async () => {
    repositoryValidateCode.reject(
      new SystemError(SYSTEM_ERROR.UNKNOWN_ERROR, SYSTEM_ERROR.UNKNOWN_ERROR, {
        message: 'Connection error',
        timestamp: Date.now(),
      }),
    )
    const response = await request(app)
      .post(apiSignUpUrl())
      .send(signupData)
      .set('Accept', 'application/json')
    expect(response.status).toBe(HTTP_CODE.SERVER_ERROR)
    const body: ApiResponse<{ data: UserResponse; error: null }> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data?.data).toBeUndefined()
    expect(body.message).toEqual(i18nInstance.t(SYSTEM_ERROR.UNKNOWN_ERROR))
    expect(body.httpCode).toEqual(HTTP_CODE.SERVER_ERROR)
    expect(body.errors).toEqual([
      {
        code: SYSTEM_ERROR.UNKNOWN_ERROR,
        message: i18nInstance.t(SYSTEM_ERROR.UNKNOWN_ERROR),
      },
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })

  test('error, email registered', async () => {
    repositoryValidateCode.resolve()
    repositorySignUp.reject(
      new AuthErrorC(
        AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
        AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
        {
          message: 'Email already registered',
          timestamp: Date.now(),
        },
      ),
    )

    const response = await request(app)
      .post(apiSignUpUrl())
      .send(signupData)
      .set('Accept', 'application/json')
    expect(response.status).toBe(HTTP_CODE.UNAUTHORIZED)
    const body: ApiResponse<undefined, BaseError> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(
      i18nInstance.t(AUTH_ERROR.EMAIL_ALREADY_REGISTERED),
    )
    expect(body.httpCode).toEqual(HTTP_CODE.UNAUTHORIZED)
    expect(body.errors).toEqual([
      {
        code: AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
        message: i18nInstance.t(AUTH_ERROR.EMAIL_ALREADY_REGISTERED),
      },
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
})
