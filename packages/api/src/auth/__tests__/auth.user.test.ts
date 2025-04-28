import { dataUser, repositoryUser } from './auth.configtest'
import { app, i18n as i18nTest } from './auth.test-base'
import { apiUserUrl } from './auth.user.test-helper'
import { AuthError } from '@auth'
import { AuthResponseBuilder } from '@utils'
import request from 'supertest'

describe('GET /user', () => {
  test('happy past', async () => {
    repositoryUser.resolve()
    const response = await request(app)
      .get(apiUserUrl())
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${dataUser.session?.access_token}`)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      new AuthResponseBuilder().data(dataUser).build(),
    )
  })

  test('without token', async () => {
    const response = await request(app)
      .get(apiUserUrl())
      .send()
      .set('Accept', 'application/json')
    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .code(401)
        .status('error')
        .message(i18nTest.t('token_required'))
        .build(),
    )
  })

  test('token do not return user', async () => {
    repositoryUser.resolve({ user: null, session: null })
    const response = await request(app)
      .get(apiUserUrl())
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${dataUser.session?.access_token}`)
    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .code(401)
        .status('error')
        .message(i18nTest.t('token_without_user'))
        .build(),
    )
  })

  test('token error', async () => {
    repositoryUser.reject(new AuthError('token_required'))
    const response = await request(app)
      .get(apiUserUrl())
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${dataUser.session?.access_token}`)
    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      new AuthResponseBuilder()
        .code(401)
        .status('error')
        .message(i18nTest.t('token_required'))
        .build(),
    )
  })
})
