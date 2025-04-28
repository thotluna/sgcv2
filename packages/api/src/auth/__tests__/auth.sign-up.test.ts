import {
  data,
  repositorySignUp,
  repositoryValidateCode,
  signupData,
} from './auth.configtest'
import { app, i18n as i18nInstance } from './auth.test-base'
import { AuthError, AuthRouter } from '@auth'
import { AuthResponseBuilder } from '@utils'
import request from 'supertest'

describe('POST /signup', () => {
  test('happy past', () => {
    const dataI = signupData
    repositoryValidateCode.resolve()
    repositorySignUp.resolve()
    return request(app)
      .post(AuthRouter.getAbsoluteRoutes().signUp)
      .send(dataI)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .data({
              data: data,
              error: null,
            })
            .build(),
        )
      })
  })

  test('bad request, password invalid format', () => {
    return request(app)
      .post(AuthRouter.getAbsoluteRoutes().signUp)
      .send({ ...signupData, password: '123' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message(i18nInstance.t('password_min_length', { lng: 'es' }))
            .build(),
        )
      })
  })

  test('bad request, email invalid format', () => {
    return request(app)
      .post('/v1/auth/signup')
      .send({ ...signupData, email: 'alan.com' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message(i18nInstance.t('email_invalid', { lng: 'es' }))
            .build(),
        )
      })
  })

  test('bad request, code client invalid format', () => {
    return request(app)
      .post(AuthRouter.getAbsoluteRoutes().signUp)
      .send({ ...signupData, code: '123' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message(
              i18nInstance.t('jwt malformed', {
                lng: 'es',
              }),
            )
            .build(),
        )
      })
  })

  test('error, code client refused', () => {
    repositoryValidateCode.reject(new AuthError('code_not_found'))
    return request(app)
      .post(AuthRouter.getAbsoluteRoutes().signUp)
      .send(signupData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message(i18nInstance.t('code_not_found'))
            .build(),
        )
      })
  })

  test('error, any other', () => {
    repositoryValidateCode.reject(new Error('db_conexion_error'))
    return request(app)
      .post(AuthRouter.getAbsoluteRoutes().signUp)
      .send(signupData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(500)
            .message(
              i18nInstance.t('db_conexion_error', {
                lng: 'es',
              }),
            )
            .build(),
        )
      })
  })

  test('error, email registered', () => {
    repositoryValidateCode.resolve()
    repositorySignUp.reject(new AuthError('auth_email_already_registed'))

    return request(app)
      .post(AuthRouter.getAbsoluteRoutes().signUp)
      .send(signupData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message(
              i18nInstance.t('auth_email_already_registed', { lng: 'es' }),
            )
            .build(),
        )
      })
  })
})
