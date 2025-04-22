import { AuthResponseBuilder } from '../../utils/auth-response-builder'
import request from 'supertest'
import { AuthError } from '../errors'
import './auth.test-base'
import { app } from './auth.test-base'
import {
  repositorySignIn,
  authRoute,
  signInData,
  data,
} from './auth.configtest'

describe('POST /singin', () => {
  test('happy past', () => {
    repositorySignIn.resolve()
    return request(app)
      .post(authRoute.SING_IN)
      .send(signInData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder().data({ data, error: null }).build(),
        )
      })
  })

  test('email invalid', () => {
    return request(app)
      .post(authRoute.SING_IN)
      .send({ ...signInData, email: 'alan.com' })
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

  test('password invalid', () => {
    return request(app)
      .post(authRoute.SING_IN)
      .send({ ...signInData, password: '123' })
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

  test('bad request', () => {
    return request(app)
      .post(authRoute.SING_IN)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message('Required, Required')
            .build(),
        )
      })
  })

  test('credential invalid', () => {
    repositorySignIn.reject(
      new AuthError('El email o la contraseña no son validos'),
    )
    return request(app)
      .post(authRoute.SING_IN)
      .set('Accept', 'application/json')
      .send(signInData)
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message('El email o la contraseña no son validos')
            .build(),
        )
      })
  })

  test('other error', () => {
    repositorySignIn.reject(new Error('other error'))
    return request(app)
      .post(authRoute.SING_IN)
      .set('Accept', 'application/json')
      .send(signInData)
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
})
