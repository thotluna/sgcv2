import request from 'supertest'
import { AuthResponseBuilder } from '../../utils/auth-response-builder'
import { AuthError } from '../errors'
import './auth.test-base'
import { app } from './auth.test-base'
import {
  authRoute,
  data,
  repositorySignUp,
  repositoryValidateCode,
  signupData,
} from './auth.configtest'

describe('POST /singup', () => {
  test('happy past', () => {
    repositoryValidateCode.resolve()
    repositorySignUp.resolve()
    return request(app)
      .post(authRoute.SING_UP)
      .send(signupData)
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
      .post(authRoute.SING_UP)
      .send({ ...signupData, password: '123' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message('La contraseña debe tener al menos 8 caracteres')
            .build(),
        )
      })
  })

  test('bad request, email invalid format', () => {
    return request(app)
      .post('/v1/auth/singup')
      .send({ ...signupData, email: 'alan.com' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message('El email no es valido')
            .build(),
        )
      })
  })

  test('bad request, code client invalid format', () => {
    return request(app)
      .post(authRoute.SING_UP)
      .send({ ...signupData, clientCode: '123' })
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

  test('bad request, res empty', () => {
    return request(app)
      .post(authRoute.SING_UP)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message('Required, Required, Required')
            .build(),
        )
      })
  })

  test('error, code client refused', () => {
    repositoryValidateCode.reject(new AuthError('Codigo de cliente no válido'))
    return request(app)
      .post(authRoute.SING_UP)
      .send(signupData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message('Codigo de cliente no válido')
            .build(),
        )
      })
  })

  test('error, any other', () => {
    repositoryValidateCode.reject(new Error('any other error'))
    return request(app)
      .post(authRoute.SING_UP)
      .send(signupData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(500)
            .message('¡Ups! Algo salió mal.')
            .build(),
        )
      })
  })

  test('error, email registered', () => {
    repositoryValidateCode.resolve()
    repositorySignUp.reject(new AuthError('El email ya esta registrado'))

    return request(app)
      .post(authRoute.SING_UP)
      .send(signupData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message('El email ya esta registrado')
            .build(),
        )
      })
  })
})
