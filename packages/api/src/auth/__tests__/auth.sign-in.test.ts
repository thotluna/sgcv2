import { repositorySignIn, signInData } from './auth.configtest'
import { apiSignInUrl, signInMock } from './auth.sign-in.test-helper'
import { app, i18n as i18nTest } from './auth.test-base'
import { buildUserMock } from './test-utils'
import { AUTH_ERROR_CODES, AuthError, VALIDATION_ERROR_CODES } from '@auth'
import { AuthResponseBuilder } from '@utils'
import request from 'supertest'

describe('POST /signin', () => {
  test('happy past', async () => {
    signInMock.resolve({ data: buildUserMock(), error: null })
    const response = await request(app)
      .post(apiSignInUrl())
      .send(signInData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .data({ data: buildUserMock(), error: null })
        .build(),
    )
  })

  test('email invalid', async () => {
    const response = await request(app)
      .post(apiSignInUrl())
      .send({ ...signInData, email: 'alan.com' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(400)
        .code(VALIDATION_ERROR_CODES.EMAIL_INVALID)
        .message(i18nTest.t(VALIDATION_ERROR_CODES.EMAIL_INVALID))
        .build(),
    )
  })

  test('password invalid', async () => {
    const response = await request(app)
      .post(apiSignInUrl())
      .send({ ...signInData, password: '123' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(400)
        .code(VALIDATION_ERROR_CODES.PASSWORD_MIN_LENGTH)
        .message(i18nTest.t(VALIDATION_ERROR_CODES.PASSWORD_MIN_LENGTH))
        .build(),
    )
  })

  test('credential invalid', async () => {
    repositorySignIn.reject(
      new AuthError(
        AUTH_ERROR_CODES.INVALID_CREDENTIALS,
        AUTH_ERROR_CODES.INVALID_CREDENTIALS,
        401,
      ),
    )
    const response = await request(app)
      .post(apiSignInUrl())
      .send(signInData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(401)
        .code(AUTH_ERROR_CODES.INVALID_CREDENTIALS)
        .message(i18nTest.t(AUTH_ERROR_CODES.INVALID_CREDENTIALS))
        .build(),
    )
  })

  test('other error', async () => {
    repositorySignIn.reject(new Error('unknown_error'))
    const response = await request(app)
      .post(apiSignInUrl())
      .send(signInData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(500)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(500)
        .code(AUTH_ERROR_CODES.UNKNOWN_ERROR)
        .message(i18nTest.t(AUTH_ERROR_CODES.UNKNOWN_ERROR))
        .build(),
    )
  })
})
