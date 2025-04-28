import { repositoryCallback, authRoute } from './auth.configtest'
import { app, i18n as i18nTest } from './auth.test-base'
import { AuthError } from '@auth'
import { AuthResponseBuilder } from '@utils'
import request from 'supertest'

describe('GET /callback', () => {
  test('happy past', () => {
    repositoryCallback.resolve()

    return request(app)
      .get(authRoute.CALLBACK + '?code=123456789')
      .set('Accept', 'application/json')
      .expect(302)
      .then(response => {
        const location = response.headers.location
        expect(location).toEqual('http://localhost:3000/auth/callback')
        const [access, refresh] = response.headers['set-cookie']
        expect(access).toBeDefined()
        expect(refresh).toBeDefined()
      })
  })

  test('without code', () => {
    repositoryCallback.resolve()

    return request(app)
      .get(authRoute.CALLBACK)
      .set('Accept', 'application/json')
      .expect(302)
      .then(response => {
        const location = response.headers.location
        expect(location).toEqual('http://localhost:3000/?signUp=true')
      })
  })

  test('happy past', () => {
    repositoryCallback.reject(new AuthError('not_found_anonymous_key'))

    return request(app)
      .get(authRoute.CALLBACK + '?code=123456789')
      .set('Accept', 'application/json')
      .expect(401)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(401)
            .message(i18nTest.t('not_found_anonymous_key'))
            .build(),
        )
      })
  })
})
