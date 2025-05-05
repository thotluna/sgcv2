import {
  callbackMock,
  apiCallbackWithCode,
  ROUTE_FRONTEND_CALLBACK,
  ROUTE_FRONTEND_REGISTER
} from './auth.callback.test-helper'
import { app } from './auth.test-base'
import request from 'supertest'

describe('GET /callback', () => {
  test.only('happy path', async () => {
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
  test.only('without code', async () => {
    const response = await request(app)
      .get(apiCallbackWithCode(''))
      .set('Accept', 'application/json')
    expect(response.status).toBe(302)
    const urlLocation = new URL(response.headers.location)
    expect(`${urlLocation.origin}${urlLocation.pathname}`).toEqual(
      ROUTE_FRONTEND_REGISTER
    )
  })
})
