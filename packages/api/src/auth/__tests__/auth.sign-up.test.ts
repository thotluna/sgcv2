import {
  repositorySignUp,
  repositoryValidateCode,
  signupData,
} from './auth.configtest'
import { apiSignUpUrl, signUpMock } from './auth.sign-up.test-helper'
import { app, i18n as i18nInstance } from './auth.test-base'
import { buildUserMock } from './test-utils'
import { AuthError } from '@auth'
import { AuthResponseBuilder } from '@utils'
import request from 'supertest'

describe('POST /signup', () => {
  test('happy past', async () => {
    repositoryValidateCode.resolve()
    signUpMock.resolve(buildUserMock())
    const response = await request(app)
      .post(apiSignUpUrl())
      .send(signupData)
      .set('Accept', 'application/json')
    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      new AuthResponseBuilder().data(buildUserMock()).build(),
    )
  })

  test('bad request, password invalid format', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send({ ...signupData, password: '123' })
      .set('Accept', 'application/json')
    expect(response.status).toBe(400)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .code(400)
        .message(i18nInstance.t('password_min_length', { lng: 'es' }))
        .build(),
    )
  })

  test('bad request, email invalid format', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send({ ...signupData, email: 'alan.com' })
      .set('Accept', 'application/json')
    expect(response.status).toBe(400)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .code(400)
        .message(i18nInstance.t('email_invalid', { lng: 'es' }))
        .build(),
    )
  })

  test('bad request, code client invalid format', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send({ ...signupData, code: '123' })
      .set('Accept', 'application/json')
    expect(response.status).toBe(400)
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

  test('error, code client refused', async () => {
    repositoryValidateCode.reject(new AuthError('code_not_found'))
    const response = await request(app)
      .post(apiSignUpUrl())
      .send(signupData)
      .set('Accept', 'application/json')
    expect(response.status).toBe(400)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .code(400)
        .message(i18nInstance.t('code_not_found'))
        .build(),
    )
  })

  test('error, any other', async () => {
    repositoryValidateCode.reject(new Error('db_conexion_error'))
    const response = await request(app)
      .post(apiSignUpUrl())
      .send(signupData)
      .set('Accept', 'application/json')
    expect(response.status).toBe(500)
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

  test('error, email registered', async () => {
    repositoryValidateCode.resolve()
    repositorySignUp.reject(new AuthError('auth_email_already_registed'))

    const response = await request(app)
      .post(apiSignUpUrl())
      .send(signupData)
      .set('Accept', 'application/json')
    expect(response.status).toBe(400)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .code(400)
        .message(i18nInstance.t('auth_email_already_registed', { lng: 'es' }))
        .build(),
    )
  })
})
