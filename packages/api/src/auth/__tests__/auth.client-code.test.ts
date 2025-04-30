import { apiClientCodeUrl } from './auth.client-code.test-helper'
import { clientCode, repositoryValidateCode } from './auth.configtest'
import { app, i18n as i18nInstance } from './auth.test-base'
import { AUTH_ERROR, AuthErrorC, SYSTEM_ERROR, SystemError } from '@auth'
import { ClientCodeType } from '@sgcv2/shared'
import { AuthResponseBuilder } from '@utils'
import 'dotenv/config'
import request from 'supertest'

describe('auth /code/validate test', () => {
  test('happy past', async () => {
    repositoryValidateCode.resolve()
    const response = await request(app)
      .post(apiClientCodeUrl())
      .send({ code: clientCode.correct })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      new AuthResponseBuilder<ClientCodeType>()
        .data(clientCode.correct as ClientCodeType)
        .build(),
    )
  })

  test('bad request', async () => {
    const response = await request(app)
      .post(apiClientCodeUrl())
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(400)
        .code(AUTH_ERROR.CLIENT_CODE_REQUIRED)
        .message(i18nInstance.t(AUTH_ERROR.CLIENT_CODE_REQUIRED))
        .build(),
    )
  })

  test('code invalid', async () => {
    const response = await request(app)
      .post(apiClientCodeUrl())
      .send({ code: clientCode.incorrect })
      .set('Accept', 'application/json')
      .set('Accept-Language', 'es')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(401)
        .code(AUTH_ERROR.TOKEN_INVALID)
        .message(i18nInstance.t(AUTH_ERROR.TOKEN_MALFORMED))
        .build(),
    )
  })

  test('code refused', async () => {
    repositoryValidateCode.reject(
      new AuthErrorC(AUTH_ERROR.TOKEN_INVALID, AUTH_ERROR.CODE_NOT_FOUND, {
        message: 'Code not found',
        timestamp: Date.now(),
      }),
    )
    const response = await request(app)
      .post(apiClientCodeUrl())
      .send({ code: clientCode.correct })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(401)
        .code(AUTH_ERROR.TOKEN_INVALID)
        .message(i18nInstance.t(AUTH_ERROR.CODE_NOT_FOUND))
        .build(),
    )
    expect(response.status).toBe(401)
  })

  test('error db', async () => {
    repositoryValidateCode.reject(
      new SystemError(SYSTEM_ERROR.UNKNOWN_ERROR, SYSTEM_ERROR.UNKNOWN_ERROR, {
        message: 'Connection error',
        timestamp: Date.now(),
      }),
    )
    const response = await request(app)
      .post(apiClientCodeUrl())
      .send({ code: clientCode.correct })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(500)
        .code(SYSTEM_ERROR.UNKNOWN_ERROR)
        .message(i18nInstance.t(SYSTEM_ERROR.UNKNOWN_ERROR))
        .build(),
    )
    expect(response.status).toBe(500)
  })
})
