import {
  callbackMock,
  apiCallbackWithCode,
  ROUTE_FRONTEND_CALLBACK,
  ROUTE_FRONTEND_REGISTER,
} from './auth.callback.test-helper'
import { app, i18n as i18nTest } from './auth.test-base'
import { AUTH_ERROR, AuthErrorC } from '@auth'
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
    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(401)
        .code(AUTH_ERROR.NOT_FOUND_ANONYMOUS_KEY)
        .message(i18nTest.t(AUTH_ERROR.NOT_FOUND_ANONYMOUS_KEY))
        .build(),
    )
  })
})
