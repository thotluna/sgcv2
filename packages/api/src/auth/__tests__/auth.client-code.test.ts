import { apiClientCodeUrl } from './auth.client-code.test-helper'
import { clientCode, repositoryValidateCode } from './auth.configtest'
import { app, i18n as i18nInstance } from './auth.test-base'
import {
  AUTH_ERROR_CODES,
  AuthError,
  DB_ERROR_CODES,
  DBErrorConexion,
  VALIDATION_ERROR_CODES,
} from '@auth'
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
        .code(VALIDATION_ERROR_CODES.CLIENT_CODE_REQUIRED)
        .message(i18nInstance.t(VALIDATION_ERROR_CODES.CLIENT_CODE_REQUIRED))
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
        .code(AUTH_ERROR_CODES.TOKEN_INVALID)
        .message(i18nInstance.t(AUTH_ERROR_CODES.TOKEN_MALFORMED))
        .build(),
    )
  })

  test('code refused', async () => {
    repositoryValidateCode.reject(
      new AuthError('code_not_found', AUTH_ERROR_CODES.CODE_NOT_FOUND, 401),
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
        .code(AUTH_ERROR_CODES.CODE_NOT_FOUND)
        .message(i18nInstance.t('code_not_found'))
        .build(),
    )
    expect(response.status).toBe(401)
  })

  test('error db', async () => {
    repositoryValidateCode.reject(
      new DBErrorConexion(
        DB_ERROR_CODES.CONNECTION,
        DB_ERROR_CODES.CONNECTION,
        500,
      ),
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
        .code(DB_ERROR_CODES.CONNECTION)
        .message(i18nInstance.t(DB_ERROR_CODES.CONNECTION))
        .build(),
    )
    expect(response.status).toBe(500)
  })
})
