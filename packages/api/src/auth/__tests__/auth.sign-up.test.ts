import {
  repositorySignUp,
  repositoryValidateCode,
  signupData,
} from './auth.configtest'
import { apiSignUpUrl, signUpMock } from './auth.sign-up.test-helper'
import { app, i18n as i18nInstance } from './auth.test-base'
import { buildUserMock } from './test-utils'
import {
  AUTH_ERROR,
  AuthErrorC,
  SYSTEM_ERROR,
  SystemError,
  VALIDATION_ERROR,
} from '@auth'
import { AuthResponseBuilder } from '@utils'
import request from 'supertest'

describe('POST /signup', () => {
  test('happy past', async () => {
    repositoryValidateCode.resolve()
    signUpMock.resolve(buildUserMock())
    const response = await request(app)
      .post(apiSignUpUrl())
      .send(signupData)
      .set('Accept', 'application/json')
    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      new AuthResponseBuilder().data(buildUserMock()).build(),
    )
  })

  test('bad request, password invalid format', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send({ ...signupData, password: '123' })
      .set('Accept', 'application/json')
    expect(response.status).toBe(400)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(400)
        .code(VALIDATION_ERROR.PASSWORD_MIN_LENGTH)
        .message(i18nInstance.t(VALIDATION_ERROR.PASSWORD_MIN_LENGTH))
        .build(),
    )
  })

  test('bad request, email invalid format', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send({ ...signupData, email: 'alan.com' })
      .set('Accept', 'application/json')
    expect(response.status).toBe(400)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(400)
        .code(VALIDATION_ERROR.EMAIL_INVALID)
        .message(i18nInstance.t(VALIDATION_ERROR.EMAIL_INVALID))
        .build(),
    )
  })

  test('bad request, code client invalid format', async () => {
    const response = await request(app)
      .post(apiSignUpUrl())
      .send({ ...signupData, code: '123' })
      .set('Accept', 'application/json')
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

  test('error, code client refused', async () => {
    repositoryValidateCode.reject(
      new AuthErrorC(AUTH_ERROR.CODE_NOT_FOUND, AUTH_ERROR.CODE_NOT_FOUND),
    )
    const response = await request(app)
      .post(apiSignUpUrl())
      .send(signupData)
      .set('Accept', 'application/json')
    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(401)
        .code(AUTH_ERROR.CODE_NOT_FOUND)
        .message(i18nInstance.t(AUTH_ERROR.CODE_NOT_FOUND))
        .build(),
    )
  })

  test('error, any other', async () => {
    repositoryValidateCode.reject(
      new SystemError(SYSTEM_ERROR.UNKNOWN_ERROR, SYSTEM_ERROR.UNKNOWN_ERROR, {
        message: 'Connection error',
        timestamp: Date.now(),
      }),
    )
    const response = await request(app)
      .post(apiSignUpUrl())
      .send(signupData)
      .set('Accept', 'application/json')
    expect(response.status).toBe(500)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(500)
        .code(SYSTEM_ERROR.UNKNOWN_ERROR)
        .message(i18nInstance.t(SYSTEM_ERROR.UNKNOWN_ERROR))
        .build(),
    )
  })

  test('error, email registered', async () => {
    repositoryValidateCode.resolve()
    repositorySignUp.reject(
      new AuthErrorC(
        AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
        AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
        {
          message: 'Email already registered',
          timestamp: Date.now(),
        },
      ),
    )

    const response = await request(app)
      .post(apiSignUpUrl())
      .send(signupData)
      .set('Accept', 'application/json')
    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(401)
        .code(AUTH_ERROR.EMAIL_ALREADY_REGISTERED)
        .message(i18nInstance.t(AUTH_ERROR.EMAIL_ALREADY_REGISTERED))
        .build(),
    )
  })
})
