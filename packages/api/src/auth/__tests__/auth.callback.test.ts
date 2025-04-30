import {
  callbackMock,
  apiCallbackWithCode,
  ROUTE_FRONTEND_CALLBACK,
  ROUTE_FRONTEND_REGISTER,
} from './auth.callback.test-helper'
import { app, i18n as i18nTest } from './auth.test-base'
import { AUTH_ERROR_CODES, AuthError } from '@auth'
import { AuthResponseBuilder } from '@utils'
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
    expect(response.headers.location).toEqual(ROUTE_FRONTEND_REGISTER)
  })

  test('error', async () => {
    callbackMock.reject(
      new AuthError(
        AUTH_ERROR_CODES.NOT_FOUND_ANONYMOUS_KEY,
        AUTH_ERROR_CODES.NOT_FOUND_ANONYMOUS_KEY,
        401,
      ),
    )

    const response = await request(app)
      .get(apiCallbackWithCode('123456789'))
      .set('Accept', 'application/json')
    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .code(401)
        .message(i18nTest.t(AUTH_ERROR_CODES.NOT_FOUND_ANONYMOUS_KEY))
        .build(),
    )
  })
})
