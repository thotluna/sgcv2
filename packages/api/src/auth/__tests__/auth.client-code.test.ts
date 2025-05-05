import {
  apiClientCodeUrl,
  CLIENT_CODE_FROM_DATA
} from './auth.client-code.test-helper'
import { app, i18n as i18nInstance } from './auth.test-base'
import { BaseError } from '@api/errors/errors'
import { ApiResponse, STATUS } from '@api/types'
import { AUTH_ERROR } from '@auth'
import { ClientCodeType, HTTP_CODE } from '@sgcv2/shared'
import 'dotenv/config'
import request from 'supertest'

describe('auth /code/validate test', () => {
  test('happy past', async () => {
    const response = await request(app)
      .post(apiClientCodeUrl())
      .send(CLIENT_CODE_FROM_DATA.VALID)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(HTTP_CODE.OK)
    const body: ApiResponse<{ code: string }, BaseError> = response.body
    expect(body.status).toEqual(STATUS.SUCCESS)
    expect(body.data).toEqual({ code: CLIENT_CODE_FROM_DATA.VALID.code })
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
      i18nInstance.t(AUTH_ERROR.CLIENT_CODE_REQUIRED)
    )
    expect(body.httpCode).toEqual(HTTP_CODE.BAD_REQUEST)
    expect(body.errors).toEqual([
      {
        code: AUTH_ERROR.CLIENT_CODE_REQUIRED,
        message: i18nInstance.t(AUTH_ERROR.CLIENT_CODE_REQUIRED)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
  test('code invalid', async () => {
    const response = await request(app)
      .post(apiClientCodeUrl())
      .send({ code: 'code invalid' })
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
        message: i18nInstance.t(AUTH_ERROR.TOKEN_MALFORMED)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
  test('code refused', async () => {
    const response = await request(app)
      .post(apiClientCodeUrl())
      .send(CLIENT_CODE_FROM_DATA.REFUSED)
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
        message: i18nInstance.t(AUTH_ERROR.CODE_NOT_FOUND)
      }
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
})
