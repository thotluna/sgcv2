import { Application } from 'express'
import { AuthsRepository } from '../types'
import { AuthService } from '../auth.service'
import { AuthController } from '../auth.controller'
import { AuthRouter } from '../auth.routes'
import { ServerApi } from '../../server'
import request from 'supertest'
import { AuthError, DBErrorConexion } from '../errors'
import {
  authRepository,
  AuthResponseBuilder,
  authRoute,
  clientCode,
  repositoryValidateCode,
} from './auth.configtest'
import { ClientCodeType } from '@sgcv2/shared'
import { IncomingMessage, Server, ServerResponse } from 'http'

describe('auth functions test', () => {
  let app: Application
  let server: Server<typeof IncomingMessage, typeof ServerResponse>
  let repository: AuthsRepository

  beforeAll(() => {
    repository = authRepository

    const serverApp = ServerApi.getInstance()
    serverApp.addRoute('/auth', getAuthRouter())
    server = serverApp.start()
    app = serverApp.getApp()
  })

  describe('POST /code/validate', () => {
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
      repositoryValidateCode.reject(
        new AuthError('Codigo de cliente no válido'),
      )
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

  describe.skip('POST /singup', () => {
    test('happy past', () => {
      const email = 'alan@gmail.com'
      const password = '12345678'
      const clientCode = '123!@#&*-456789aB-cDeFgHiJ-kLmNoPqR'

      const data = {
        user: {
          id: '123456789',
          email,
          created_at: Date.now(),
          role: 'authenticated',
        },
        session: {
          provider_token: 'password',
        },
      }
      ;(repository.validateCodeClient as jest.Mock).mockResolvedValue(true)
      ;(repository.singUp as jest.Mock).mockResolvedValue({
        data,
        error: null,
      })
      return request(app)
        .post('/v1/auth/singup')
        .send({ email, password, clientCode })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual({
            message: 'ok',
            status: 'ok',
            data: {
              data,
              error: null,
            },
          })
        })
    })

    test('bad request, password invalid format', () => {
      const email = 'alan@gmail.com'
      const password = '12345'
      const clientCode = '123!@#&*-456789aB-cDeFgHiJ-kLmNoPqR'

      return request(app)
        .post('/v1/auth/singup')
        .send({ email, password, clientCode })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({
            message: 'La contraseña debe tener al menos 8 caracteres',
            status: 'fail',
          })
        })
    })

    test('bad request, email invalid format', () => {
      const email = 'alan@gmail'
      const password = '12345678'
      const clientCode = '123!@#&*-456789aB-cDeFgHiJ-kLmNoPqR'

      return request(app)
        .post('/v1/auth/singup')
        .send({ email, password, clientCode })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({
            message: 'El email no es valido',
            status: 'fail',
          })
        })
    })

    test('bad request, code client invalid format', () => {
      const email = 'alan@gmail.com'
      const password = '12345678'
      const clientCode = '123!@#&*-456789aB-cDeFgHiJ-kLm'

      return request(app)
        .post('/v1/auth/singup')
        .send({ email, password, clientCode })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({
            message: 'Codigo de cliente tiene un formato invalido',
            status: 'fail',
          })
        })
    })

    test('bad request, res empty', () => {
      const email = ''
      const password = ''
      const clientCode = ''

      return request(app)
        .post('/v1/auth/singup')
        .send({ email, password, clientCode })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({
            message:
              'El email no es valido, La contraseña debe tener al menos 8 caracteres, Codigo de cliente tiene un formato invalido',
            status: 'fail',
          })
        })
    })

    test('error, code client refused', () => {
      const email = 'alan@gmail.com'
      const password = '12345678'
      const clientCode = '123!@#&*-456789aB-cDeFgHiJ-kLmNoPqR'

      ;(repository.validateCodeClient as jest.Mock).mockRejectedValue(
        new AuthError('Codigo de cliente no válido'),
      )
      return request(app)
        .post('/v1/auth/singup')
        .send({ email, password, clientCode })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .then(response => {
          expect(response.body).toEqual({
            message: 'Codigo de cliente no válido',
            status: 'fail',
          })
        })
    })

    test('error, any other', () => {
      const email = 'alan@gmail.com'
      const password = '12345678'
      const clientCode = '123!@#&*-456789aB-cDeFgHiJ-kLmNoPqR'

      ;(repository.validateCodeClient as jest.Mock).mockRejectedValue(
        new Error('any other error'),
      )
      return request(app)
        .post('/v1/auth/singup')
        .send({ email, password, clientCode })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .then(response => {
          expect(response.body).toEqual({
            message:
              'Disculpe, hemos tenido un problema. Por favor inténtelo más tarde',
            status: 'fail',
          })
        })
    })
  })

  describe('POST /singin', () => {
    test('happy past', () => {})
  })

  afterAll(() => {
    server.close()
  })

  function getAuthRouter() {
    const service = new AuthService(repository)
    const authController = new AuthController(service)
    const authRouter = new AuthRouter(authController)
    authRouter.initializeRoutes()
    return authRouter.getRouter()
  }
})
