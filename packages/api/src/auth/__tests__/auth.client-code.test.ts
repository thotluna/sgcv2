import { AuthResponseBuilder } from '../../utils/auth-response-builder'
import { AuthError, DBErrorConexion } from '../errors'
import {
  authRoute,
  clientCode,
  repositoryValidateCode,
} from './auth.configtest'
import './auth.test-base'
import { app, i18n as i18nInstance } from './auth.test-base'
import { ClientCodeType } from '@sgcv2/shared'
import 'dotenv/config'
import request from 'supertest'

describe('auth /code/validate test', () => {
  test('happy past', () => {
    repositoryValidateCode.resolve()
    return request(app)
      .post(authRoute.VALIDATE_CODE)
      .send({ code: clientCode.correct })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder<ClientCodeType>()
            .data(clientCode.correct as ClientCodeType)
            .build(),
        )
      })
  })

  test('bad request', () => {
    return request(app)
      .post(authRoute.VALIDATE_CODE)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message(i18nInstance.t('client_code_required'))
            .build(),
        )
      })
  })

  test('code invalid', () => {
    return request(app)
      .post(authRoute.VALIDATE_CODE)
      .send({ code: clientCode.incorrect })
      .set('Accept', 'application/json')
      .set('Accept-Language', 'es')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message(i18nInstance.t('jwt malformed'))
            .build(),
        )
      })
  })

  test('code refused', () => {
    repositoryValidateCode.reject(new AuthError('code_not_found'))
    return request(app)
      .post(authRoute.VALIDATE_CODE)
      .send({ code: clientCode.correct })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(401)
            .message(i18nInstance.t('code_not_found'))
            .build(),
        )
      })
  })

  test('error db', () => {
    repositoryValidateCode.reject(new DBErrorConexion('db_conexion_error'))
    return request(app)
      .post(authRoute.VALIDATE_CODE)
      .send({ code: clientCode.correct })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
      .then(response => {
        new AuthResponseBuilder()
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(500)
            .message(i18nInstance.t('db_conexion_error', { lng: 'es' }))
            .build(),
        )
      })
  })
})
