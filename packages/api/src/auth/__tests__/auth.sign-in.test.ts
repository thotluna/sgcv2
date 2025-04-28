import {
  repositorySignIn,
  authRoute,
  signInData,
  data,
} from './auth.configtest'
import { app, i18n as i18nTest } from './auth.test-base'
import { AuthError } from '@auth'
import { AuthResponseBuilder } from '@utils'
import request from 'supertest'

describe('POST /signin', () => {
  test('happy past', () => {
    repositorySignIn.resolve()
    return request(app)
      .post(authRoute.SIGN_IN)
      .send(signInData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder().data({ data, error: null }).build(),
        )
      })
  })

  test('email invalid', () => {
    return request(app)
      .post(authRoute.SIGN_IN)
      .send({ ...signInData, email: 'alan.com' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message(i18nTest.t('email_invalid'))
            .build(),
        )
      })
  })

  test('password invalid', () => {
    return request(app)
      .post(authRoute.SIGN_IN)
      .send({ ...signInData, password: '123' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message(i18nTest.t('password_min_length'))
            .build(),
        )
      })
  })

  test('credential invalid', () => {
    repositorySignIn.reject(new AuthError('invalid_credentials'))
    return request(app)
      .post(authRoute.SIGN_IN)
      .set('Accept', 'application/json')
      .send(signInData)
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message(i18nTest.t('invalid_credentials'))
            .build(),
        )
      })
  })

  test('other error', () => {
    repositorySignIn.reject(new Error('unknown_error'))
    return request(app)
      .post(authRoute.SIGN_IN)
      .set('Accept', 'application/json')
      .send(signInData)
      .expect('Content-Type', /json/)
      .expect(500)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(500)
            .message(i18nTest.t('unknown_error'))
            .build(),
        )
      })
  })
})
