import {
  callbackMock,
  apiCallbackWithCode,
  ROUTE_FRONTEND_CALLBACK,
  ROUTE_FRONTEND_REGISTER,
} from './auth.callback.test-helper'
import { app, i18n as i18nTest } from './auth.test-base'
import { ApiResponses, STATUS } from '@api/types'
import { AUTH_ERROR, AuthErrorC } from '@auth'
import { ErrorDetail, HTTP_CODE } from '@sgcv2/shared'
import request from 'supertest'

describe('GET /callback', () => {
  test('happy path', async () => {
    callbackMock.resolve()

    const response = await request(app)
      .get(apiCallbackWithCode('123456789'))
      .set('Accept', 'application/json')
    expect(response.status).toBe(302)
    expect(response.headers.location).toEqual(ROUTE_FRONTEND_CALLBACK)
    const [access, refresh] = response.headers['set-cookie'] || []
    expect(access).toBeDefined()
    expect(refresh).toBeDefined()
  })

  test('without code', async () => {
    callbackMock.resolve()

    const response = await request(app)
      .get(apiCallbackWithCode(''))
      .set('Accept', 'application/json')
    expect(response.status).toBe(302)
    const urlLocation = new URL(response.headers.location)
    expect(`${urlLocation.origin}${urlLocation.pathname}`).toEqual(
      ROUTE_FRONTEND_REGISTER,
    )
  })

  test('error', async () => {
    callbackMock.reject(
      new AuthErrorC(
        AUTH_ERROR.NOT_FOUND_ANONYMOUS_KEY,
        AUTH_ERROR.NOT_FOUND_ANONYMOUS_KEY,
      ),
    )

    const response = await request(app)
      .get(apiCallbackWithCode('123456789'))
      .set('Accept', 'application/json')
    expect(response.status).toBe(HTTP_CODE.UNAUTHORIZED)
    const body: ApiResponses<null, ErrorDetail> = response.body
    expect(body.status).toEqual(STATUS.ERROR)
    expect(body.data).toBeUndefined()
    expect(body.message).toEqual(i18nTest.t(AUTH_ERROR.NOT_FOUND_ANONYMOUS_KEY))
    expect(body.httpCode).toEqual(HTTP_CODE.UNAUTHORIZED)
    expect(body.errors).toEqual([
      {
        code: AUTH_ERROR.NOT_FOUND_ANONYMOUS_KEY,
        message: i18nTest.t(AUTH_ERROR.NOT_FOUND_ANONYMOUS_KEY),
      },
    ])
    expect(body.metadata).toBeUndefined()
    expect(body.timestamp).not.toBeNull()
  })
})
