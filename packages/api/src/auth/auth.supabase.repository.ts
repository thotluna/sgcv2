import type { CallbackResult, UserResponse } from '@auth'
import {
  SUPABASE_URLs,
  AuthError,
  DBError,
  DBErrorConexion,
  AuthRespository,
  DB_ERROR_CODES,
  AUTH_ERROR_CODES,
} from '@auth'
import { Database } from '@sgcv2/shared'
import { SupabaseClient, createClient } from '@supabase/supabase-js'

export class SupabaseAuthRepository implements AuthRespository {
  private client: SupabaseClient = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROL!,
  )

  saveCustomerCode = async (token: string, email: string) => {
    const { data, error } = await this.client
      .from('clientcode')
      .insert([{ code: token, email }])
      .select()

    if (error) {
      throw new DBError(
        DB_ERROR_CODES.CONNECTION,
        DB_ERROR_CODES.CONNECTION,
        500,
      )
    }

    return data
  }

  // Deprecated
  validateCustomerCode = async (code: string) => {
    const { error } = await this.client
      .from('clientcode')
      .select('created_at, claimed')
      .eq('code', code)
      .eq('claimed', false)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new AuthError(
          AUTH_ERROR_CODES.CODE_NOT_FOUND,
          AUTH_ERROR_CODES.CODE_NOT_FOUND,
          401,
        )
      }
      throw new DBErrorConexion(
        DB_ERROR_CODES.CONNECTION,
        DB_ERROR_CODES.CONNECTION,
        500,
      )
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
        throw new AuthError(
          AUTH_ERROR_CODES.INVALID_CODE,
          AUTH_ERROR_CODES.INVALID_CODE,
        )
      }
      if (error.status === 422) {
        throw new AuthError(
          AUTH_ERROR_CODES.EMAIL_ALREADY_REGISTERED,
          AUTH_ERROR_CODES.EMAIL_ALREADY_REGISTERED,
          401,
        )
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
        throw new AuthError(
          AUTH_ERROR_CODES.INVALID_CREDENTIALS,
          AUTH_ERROR_CODES.INVALID_CREDENTIALS,
          400,
        )
      }
    }

    return data
  }

  closeCustomerCode = async (code: string) => {
    const { error } = await this.client
      .from('clientcode')
      .update({ claimed: true })
      .eq('code', code)
      .eq('claimed', false)
      .single()

    return error === null
  }

  async callback(code: string, codeVerifier: string) {
    const { SUPABASE_ANON_KEY: apiKey } = process.env

    if (apiKey === undefined) {
      throw new AuthError(
        AUTH_ERROR_CODES.NOT_FOUND_ANONYMOUS_KEY,
        AUTH_ERROR_CODES.NOT_FOUND_ANONYMOUS_KEY,
        500,
      )
    }
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
  }

  async getUser(access_token: string) {
    const { data, error } = await this.client.auth.getUser(access_token)
    if (error)
      throw new AuthError(AUTH_ERROR_CODES.UNKNOWN_ERROR, error.message, 400)

    return data as unknown as UserResponse
  }
}
