import 'dotenv/config'
import request from 'supertest'
import { ClientCodeType } from '@sgcv2/shared'
import { AuthError, DBErrorConexion } from '../errors'
import {
  authRoute,
  clientCode,
  repositoryValidateCode,
} from './auth.configtest'
import { AuthResponseBuilder } from '../../utils/auth-response-builder'

import './auth.test-base'
import { app } from './auth.test-base'

describe('auth /code/validate test', () => {
  test('happy past', () => {
    repositoryValidateCode.resolve()
    return request(app)
      .post(authRoute.VALIDATE_CODE)
      .send({ clientCode: clientCode.correct })
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
            .message('Required')
            .build(),
        )
      })
  })

  test('code invalid', () => {
    return request(app)
      .post(authRoute.VALIDATE_CODE)
      .send({ clientCode: clientCode.incorrect })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message('Codigo de cliente tiene un formato invalido')
            .build(),
        )
      })
  })

  test('code refused', () => {
    repositoryValidateCode.reject(new AuthError('Codigo de cliente no válido'))
    return request(app)
      .post(authRoute.VALIDATE_CODE)
      .send({ clientCode: clientCode.correct })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(401)
            .message('Codigo de cliente no válido')
            .build(),
        )
      })
  })

  test('error db', () => {
    repositoryValidateCode.reject(
      new DBErrorConexion(
        'Ups... hemos tenido un problema. Por favor inténtelo más tarde',
      ),
    )
    return request(app)
      .post(authRoute.VALIDATE_CODE)
      .send({ clientCode: clientCode.correct })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
      .then(response => {
        new AuthResponseBuilder()
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(500)
            .message('error en la conexion. por favor intentelo mas tarde')
            .build(),
        )
      })
  })
})
