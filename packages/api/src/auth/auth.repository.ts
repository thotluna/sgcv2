import { AuthError, DBErrorConexion } from './errors'
import {
  AuthsRepository as AuthRepository,
  CallbackResult,
  UserResponse,
} from './types'
import { Database } from '@sgcv2/shared'
import { SupabaseClient, createClient } from '@supabase/supabase-js'

export const SUPABASE_URLs = {
  AUTHORIZATION: `${process.env.SUPABASE_URL}/auth/v1/authorize`,
  EXGHANGE: `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=pkce`,
} as const

export class SupabaseAuthRepository implements AuthRepository {
  private client: SupabaseClient = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROL!,
  )

  validateCodeClient = async (codeClient: string) => {
    const beforeTime = new Date(Date.now() - 72 * 60 * 60 * 1000)

    const { error } = await this.client
      .from('clientcode')
      .select('created_at, claimed')
      .eq('code', codeClient)
      .eq('claimed', false)
      .gte('created_at', beforeTime.toISOString())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new AuthError('auth_error_invalid_client_code')
      }
      throw new DBErrorConexion('db_conexion_error')
    }

    return true
  }

  signUp = async (email: string, password: string) => {
    const signUpData = {
      email,
      password,
    }

    const { data, error } = await this.client.auth.signUp(signUpData)

    if (error) {
      if (
        error.name === 'AuthApiError' &&
        error.message === 'Database error saving new user'
      ) {
        throw new AuthError('auth_error_invalid_client_code')
      }
      if (error.status === 422) {
        throw new AuthError('auth_email_already_registed')
      }
    }
    return data
  }

  signIn = async (email: string, password: string) => {
    const signInData = {
      email,
      password,
    }

    const { error, data } =
      await this.client.auth.signInWithPassword(signInData)

    if (error) {
      if (error.status === 400) {
        throw new AuthError('invalid_credentials')
      }
    }

    return data
  }

  closeCodeClient = async (codeClient: string) => {
    const { error } = await this.client
      .from('clientcode')
      .update({ claimed: true })
      .eq('code', codeClient)
      .eq('claimed', false)
      .single()

    return error === null
  }

  async callback(code: string, codeVerifier: string) {
    const { SUPABASE_ANON_KEY: apiKey } = process.env

    if (apiKey === undefined) {
      throw new AuthError('not_found_anonymous_key')
    }

    try {
      const request = await fetch(SUPABASE_URLs.EXGHANGE, {
        method: 'POST',
        headers: {
          apiKey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_code: code,
          code_verifier: codeVerifier,
        }),
      }).then(result => result.json())

      return request as CallbackResult
    } catch (error) {
      throw new AuthError((error as Error).message)
    }
  }

  async getUser(access_token: string) {
    const { data, error } = await this.client.auth.getUser(access_token)
    if (error) throw new AuthError(error.message)

    return data as unknown as UserResponse
  }
}
