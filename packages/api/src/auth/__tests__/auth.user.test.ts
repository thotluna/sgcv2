import { dataUser, repositoryUser } from './auth.configtest'
import { app, i18n as i18nTest } from './auth.test-base'
import { apiUserUrl, getToken, TypeTokens } from './auth.user.test-helper'
import { AUTH_ERROR } from '@auth/errors'
import { AuthResponseBuilder } from '@utils'
import request from 'supertest'

describe('GET /user', () => {
  test('happy past', async () => {
    repositoryUser.resolve()
    const response = await request(app)
      .get(apiUserUrl())
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Beare ${getToken(TypeTokens.OK)}`)
    expect(response.body).toEqual(
      new AuthResponseBuilder().data(dataUser).build(),
    )
    expect(response.status).toBe(200)
  })

  test('without token', async () => {
    const response = await request(app)
      .get(apiUserUrl())
      .set('Accept', 'application/json')
    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .code(AUTH_ERROR.TOKEN_REQUIRED)
        .httpCode(401)
        .message(i18nTest.t(AUTH_ERROR.TOKEN_REQUIRED))
        .build(),
    )
  })

  test('with empty bearer', async () => {
    const response = await request(app)
      .get(apiUserUrl())
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Beare ${getToken(TypeTokens.EMPTY)}`)
    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .code(AUTH_ERROR.TOKEN_INVALID)
        .httpCode(401)
        .message(i18nTest.t(AUTH_ERROR.TOKEN_MALFORMED))
        .build(),
    )
  })

  test('token do not return user', async () => {
    repositoryUser.resolve({ user: null, session: null })
    const response = await request(app)
      .get(apiUserUrl())
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Beare ${getToken(TypeTokens.OK)}`)
    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .httpCode(401)
        .code(AUTH_ERROR.TOKEN_INVALID)
        .status('error')
        .message(i18nTest.t(AUTH_ERROR.TOKEN_INVALID))
        .build(),
    )
  })

  test('token malformed', async () => {
    const response = await request(app)
      .get(apiUserUrl())
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${getToken(TypeTokens.MAL_FORMAT)}`)
    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .code(AUTH_ERROR.TOKEN_INVALID)
        .httpCode(401)
        .status('error')
        .message(i18nTest.t(AUTH_ERROR.TOKEN_MALFORMED))
        .build(),
    )
  })
})
