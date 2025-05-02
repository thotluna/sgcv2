import {
  PROVIDER_GOOGLE,
  PROVIDER_INVALID,
  EXPECTED_PATHNAME,
  EXPECTED_CODE_CHALLENGE_METHOD,
  apiAuthorizeUrl,
} from './auth.authorize.test-helper'
import { repositorySignIn } from './auth.configtest'
import { app, i18n as i18nInstance } from './auth.test-base'
import { ApiResponse, STATUS } from '@api/types'
import { authorizeDataType, PROVIDER_ERROR, ProviderError } from '@auth'
import { HTTP_CODE } from '@sgcv2/shared'
import request from 'supertest'

describe('GET /authorize', () => {
  test('happy past', () => {
    repositorySignIn.resolve()
    return request(app)
      .get(apiAuthorizeUrl({ provider: PROVIDER_GOOGLE }))
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        const body: ApiResponse<authorizeDataType> = response.body
        expect(body.status).toEqual(STATUS.SUCCESS)
        expect(body.httpCode).toEqual(HTTP_CODE.OK)
        expect(body.data?.codeVerifier).not.toBeNull()
        expect(body.data?.url).not.toBeNull()
      })
  })

  test('return url', () => {
    repositorySignIn.resolve()
    return request(app)
      .get(apiAuthorizeUrl({ provider: PROVIDER_GOOGLE }))
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        const body: ApiResponse<authorizeDataType> = response.body
        const url = new URL(body.data!.url)
        expect(url.origin).toEqual(process.env.SUPABASE_URL)
        expect(url.pathname).toEqual(EXPECTED_PATHNAME)
        expect(url.searchParams.get('provider')).toEqual(PROVIDER_GOOGLE)
        expect(url.searchParams.get('redirect_to')).not.toBeNull()
        expect(url.searchParams.get('code_challenge')).not.toBeNull()
        expect(url.searchParams.get('code_challenge_method')).toEqual(
          EXPECTED_CODE_CHALLENGE_METHOD,
        )
      })
  })

  test('bad request, provider invalid', () => {
    const error = new ProviderError({
      code: PROVIDER_ERROR.PROVIDER_INVALID,
      message: i18nInstance.t(PROVIDER_ERROR.PROVIDER_INVALID),
    })
    return request(app)
      .get(apiAuthorizeUrl({ provider: PROVIDER_INVALID }))
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        const body: ApiResponse<authorizeDataType> = response.body
        expect(body.status).toEqual(STATUS.ERROR)
        expect(body.data).toBeUndefined()
        expect(body.httpCode).toEqual(HTTP_CODE.BAD_REQUEST)
        expect(body.message).toEqual(
          i18nInstance.t(PROVIDER_ERROR.PROVIDER_INVALID),
        )
        expect(body.errors).toEqual([
          {
            code: error.code,
            message: error.message,
          },
        ])
        expect(body.metadata).toBeUndefined()
        expect(body.timestamp).not.toBeNull()
        // expect(response.body).toEqual(
        //   // new AuthResponseBuilder()
        //   //   .status('error')
        //   //   .httpCode(400)
        //   //   .code(PROVIDER_ERROR.PROVIDER_INVALID)
        //   //   .message(i18nInstance.t(PROVIDER_ERROR.PROVIDER_INVALID))
        //   //   .build(),

        // )
      })
  })
})
