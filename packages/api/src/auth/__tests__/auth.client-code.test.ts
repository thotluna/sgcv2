import { apiClientCodeUrl } from './auth.client-code.test-helper'
import { clientCode, repositoryValidateCode } from './auth.configtest'
import { app, i18n as i18nInstance } from './auth.test-base'
import { ApiResponse, STATUS } from '@api/types'
import { AUTH_ERROR, AuthErrorC, SYSTEM_ERROR, SystemError } from '@auth'
import { BaseError, ClientCodeType, HTTP_CODE } from '@sgcv2/shared'
import 'dotenv/config'
import request from 'supertest'

describe('auth /code/validate test', () => {
  test('happy past', async () => {
    repositoryValidateCode.resolve()
    const response = await request(app)
      .post(apiClientCodeUrl())
      .send({ code: clientCode.correct })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(HTTP_CODE.OK)
    const body: ApiResponse<{ code: string }, BaseError> = response.body
    expect(body.status).toEqual(STATUS.SUCCESS)
    expect(body.data).toEqual({ code: clientCode.correct })
    expect(body.message).toBeUndefined()
    expect(body.httpCode).toEqual(HTTP_CODE.OK)
    expect(body.errors).toEqual([])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })

  test('bad request', async () => {
    const response = await request(app)
      .post(apiClientCodeUrl())
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(HTTP_CODE.BAD_REQUEST)
    const body: ApiResponse<ClientCodeType, BaseError> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(
      i18nInstance.t(AUTH_ERROR.CLIENT_CODE_REQUIRED),
    )
    expect(body.httpCode).toEqual(HTTP_CODE.BAD_REQUEST)
    expect(body.errors).toEqual([
      {
        code: AUTH_ERROR.CLIENT_CODE_REQUIRED,
        message: i18nInstance.t(AUTH_ERROR.CLIENT_CODE_REQUIRED),
      },
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })

  test('code invalid', async () => {
    const response = await request(app)
      .post(apiClientCodeUrl())
      .send({ code: clientCode.incorrect })
      .set('Accept', 'application/json')
      .set('Accept-Language', 'es')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(HTTP_CODE.UNAUTHORIZED)
    const body: ApiResponse<ClientCodeType, BaseError> = response.body
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

  test('code refused', async () => {
    repositoryValidateCode.reject(
      new AuthErrorC(AUTH_ERROR.CODE_NOT_FOUND, AUTH_ERROR.CODE_NOT_FOUND, {
        message: 'Code not found',
        timestamp: Date.now(),
      }),
    )
    const response = await request(app)
      .post(apiClientCodeUrl())
      .send({ code: clientCode.correct })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(HTTP_CODE.UNAUTHORIZED)
    const body: ApiResponse<string, BaseError> = response.body
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

  test('error db', async () => {
    repositoryValidateCode.reject(
      new SystemError(SYSTEM_ERROR.UNKNOWN_ERROR, SYSTEM_ERROR.UNKNOWN_ERROR, {
        message: 'Connection error',
        timestamp: Date.now(),
      }),
    )
    const response = await request(app)
      .post(apiClientCodeUrl())
      .send({ code: clientCode.correct })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(HTTP_CODE.SERVER_ERROR)
    const body: ApiResponse<string, BaseError> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(i18nInstance.t(SYSTEM_ERROR.UNKNOWN_ERROR))
    expect(body.httpCode).toEqual(HTTP_CODE.SERVER_ERROR)
    expect(body.errors).toEqual([
      {
        code: SYSTEM_ERROR.UNKNOWN_ERROR,
        message: i18nInstance.t(SYSTEM_ERROR.UNKNOWN_ERROR),
      },
    ])
  })
})
