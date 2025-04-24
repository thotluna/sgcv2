import { AuthResponseBuilder } from '../../utils/auth-response-builder'
import { AuthError } from '../errors'
import { repositoryCallback, authRoute } from './auth.configtest'
import './auth.test-base'
import { app } from './auth.test-base'
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
    repositoryCallback.reject(new AuthError('error'))

    return request(app)
      .get(authRoute.CALLBACK + '?code=123456789')
      .set('Accept', 'application/json')
      .expect(401)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(401)
            .message('error')
            .build(),
        )
      })
  })
})
