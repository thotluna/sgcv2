import { AuthResponseBuilder } from '../../utils/auth-response-builder'
import { AuthError } from '../errors'
import { authRoute, dataUser, repositoryUser } from './auth.configtest'
import { app, i18n as i18nTest } from './auth.test-base'
import request from 'supertest'

describe('GET /user', () => {
  test('happy past', () => {
    repositoryUser.resolve()
    return request(app)
      .get(authRoute.USER)
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${dataUser.session?.access_token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder().data(dataUser).build(),
        )
      })
  })

  test('without token', () => {
    return request(app)
      .get(authRoute.USER)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .code(401)
            .status('error')
            .message(i18nTest.t('token_required'))
            .build(),
        )
      })
  })

  test('token do not return user', () => {
    repositoryUser.resolve({ user: null, session: null })
    return request(app)
      .get(authRoute.USER)
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${dataUser.session?.access_token}`)
      .expect('Content-Type', /json/)
      .expect(401)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .code(401)
            .status('error')
            .message(i18nTest.t('token_without_user'))
            .build(),
        )
      })
  })

  test('token error', () => {
    repositoryUser.reject(new AuthError(i18nTest.t('token_required')))
    return request(app)
      .get(authRoute.USER)
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${dataUser.session?.access_token}`)
      .expect('Content-Type', /json/)
      .expect(401)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .code(401)
            .status('error')
            .message(i18nTest.t('token_required'))
            .build(),
        )
      })
  })
})
