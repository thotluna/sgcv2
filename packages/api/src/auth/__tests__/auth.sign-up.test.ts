import {
  repositorySignUp,
  repositoryValidateCode,
  signupData,
} from './auth.configtest'
import { apiSignUpUrl, signUpMock } from './auth.sign-up.test-helper'
import { app, i18n as i18nInstance } from './auth.test-base'
import { buildUserMock } from './test-utils'
import {
  AUTH_ERROR_CODES,
  AuthError,
  DB_ERROR_CODES,
  VALIDATION_ERROR_CODES,
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
        .code(VALIDATION_ERROR_CODES.PASSWORD_MIN_LENGTH)
        .message(i18nInstance.t(VALIDATION_ERROR_CODES.PASSWORD_MIN_LENGTH))
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
        .code(VALIDATION_ERROR_CODES.EMAIL_INVALID)
        .message(i18nInstance.t(VALIDATION_ERROR_CODES.EMAIL_INVALID))
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
        .code(AUTH_ERROR_CODES.TOKEN_INVALID)
        .message(i18nInstance.t(AUTH_ERROR_CODES.TOKEN_MALFORMED))
        .build(),
    )
  })

  test('error, code client refused', async () => {
    repositoryValidateCode.reject(
      new AuthError(
        AUTH_ERROR_CODES.CODE_NOT_FOUND,
        AUTH_ERROR_CODES.CODE_NOT_FOUND,
        401,
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
        .code(AUTH_ERROR_CODES.CODE_NOT_FOUND)
        .message(i18nInstance.t(AUTH_ERROR_CODES.CODE_NOT_FOUND))
        .build(),
    )
  })

  test('error, any other', async () => {
    repositoryValidateCode.reject(new Error(DB_ERROR_CODES.CONNECTION))
    const response = await request(app)
      .post(apiSignUpUrl())
      .send(signupData)
      .set('Accept', 'application/json')
    expect(response.status).toBe(500)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .status('error')
        .httpCode(500)
        .code(DB_ERROR_CODES.CONNECTION)
        .message(i18nInstance.t(DB_ERROR_CODES.CONNECTION))
        .build(),
    )
  })

  test('error, email registered', async () => {
    repositoryValidateCode.resolve()
    repositorySignUp.reject(
      new AuthError(
        AUTH_ERROR_CODES.EMAIL_ALREADY_REGISTERED,
        AUTH_ERROR_CODES.EMAIL_ALREADY_REGISTERED,
        401,
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
        .code(AUTH_ERROR_CODES.EMAIL_ALREADY_REGISTERED)
        .message(i18nInstance.t(AUTH_ERROR_CODES.EMAIL_ALREADY_REGISTERED))
        .build(),
    )
  })
})
