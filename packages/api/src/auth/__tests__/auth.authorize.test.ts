import { AuthRouter } from '../auth.routes'
import { repositorySignIn } from './auth.configtest'
import { app, i18n as i18nInstance } from './auth.test-base'
import { authorizeDataType } from '@auth'
import { ApiResponse } from '@sgcv2/shared'
import { AuthResponseBuilder } from '@utils'
import request from 'supertest'

describe('GET /authorize', () => {
  test('happy past', () => {
    repositorySignIn.resolve()
    return request(app)
      .get(AuthRouter.getAbsoluteRoutes().authorize + '?provider=google')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        const body: ApiResponse<authorizeDataType> = response.body
        expect(body.code).toEqual(200)
        expect(body.status).toEqual('success')
        expect(body.data?.codeVerifier).not.toBeNull()
        expect(body.data?.url).not.toBeNull()
      })
  })

  test('return url', () => {
    repositorySignIn.resolve()
    return request(app)
      .get(AuthRouter.getAbsoluteRoutes().authorize + '?provider=google')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        const body: ApiResponse<authorizeDataType> = response.body
        const url = new URL(body.data!.url)
        expect(url.origin).toEqual(process.env.SUPABASE_URL)
        expect(url.pathname).toEqual('/auth/v1/authorize')
        expect(url.searchParams.get('provider')).toEqual('google')
        expect(url.searchParams.get('redirect_to')).not.toBeNull()
        expect(url.searchParams.get('code_challenge')).not.toBeNull()
        expect(url.searchParams.get('code_challenge_method')).toEqual('S256')
      })
  })

  test('bad request, provider invalid', () => {
    return request(app)
      .get(AuthRouter.getAbsoluteRoutes().authorize + '?provider=invalid')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          new AuthResponseBuilder()
            .status('error')
            .code(400)
            .message(i18nInstance.t('provider_invalid'))
            .build(),
        )
      })
  })
})
