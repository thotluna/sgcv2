import { apiClientCodeUrl } from './auth.client-code.test-helper'
import { clientCode, repositoryValidateCode } from './auth.configtest'
import { app, i18n as i18nInstance } from './auth.test-base'
import { AUTH_ERROR_CODES, AuthError, DBErrorConexion } from '@auth'
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
        .code(400)
        .message(i18nInstance.t('client_code_required'))
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
    expect(response.status).toBe(400)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .code(400)
        .message(AUTH_ERROR_CODES.TOKEN_MALFORMED)
        .build(),
    )
  })

  test('code refused', async () => {
    repositoryValidateCode.reject(new AuthError('code_not_found'))
    const response = await request(app)
      .post(apiClientCodeUrl())
      .send({ code: clientCode.correct })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .code(401)
        .message(i18nInstance.t('code_not_found'))
        .build(),
    )
  })

  test('error db', async () => {
    repositoryValidateCode.reject(new DBErrorConexion('db_conexion_error'))
    const response = await request(app)
      .post(apiClientCodeUrl())
      .send({ code: clientCode.correct })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
    expect(response.status).toBe(500)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .code(500)
        .message(i18nInstance.t('db_conexion_error', { lng: 'es' }))
        .build(),
    )
  })
})
