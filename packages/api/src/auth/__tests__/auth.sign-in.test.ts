import { repositorySignIn, signInData } from './auth.configtest'
import { apiSignInUrl, signInMock } from './auth.sign-in.test-helper'
import { app, i18n as i18nTest } from './auth.test-base'
import { buildUserMock } from './test-utils'
import { AuthError } from '@auth'
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
        .code(400)
        .message(i18nTest.t('email_invalid'))
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
        .code(400)
        .message(i18nTest.t('password_min_length'))
        .build(),
    )
  })

  test('credential invalid', async () => {
    repositorySignIn.reject(new AuthError('invalid_credentials'))
    const response = await request(app)
      .post(apiSignInUrl())
      .send(signInData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .code(400)
        .message(i18nTest.t('invalid_credentials'))
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
        .code(500)
        .message(i18nTest.t('unknown_error'))
        .build(),
    )
  })
})
