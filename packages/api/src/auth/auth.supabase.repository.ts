import type { CallbackResult, UserResponse } from '@auth'
import {
  SUPABASE_URLs,
  AuthRespository,
  SYSTEM_ERROR,
  SystemError,
  AuthErrorC,
  AUTH_ERROR,
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
      throw new SystemError(
        SYSTEM_ERROR.UNKNOWN_ERROR,
        SYSTEM_ERROR.UNKNOWN_ERROR,
        {
          message: error.message,
          timestamp: Date.now(),
        },
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
        throw new AuthErrorC(
          AUTH_ERROR.CODE_NOT_FOUND,
          AUTH_ERROR.CODE_NOT_FOUND,
          {
            message: error.message,
            timestamp: Date.now(),
          },
        )
      }
      throw new SystemError(
        SYSTEM_ERROR.UNKNOWN_ERROR,
        SYSTEM_ERROR.UNKNOWN_ERROR,
        {
          message: error.message,
          timestamp: Date.now(),
        },
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
        throw new AuthErrorC(AUTH_ERROR.INVALID_CODE, AUTH_ERROR.INVALID_CODE, {
          message: error.message,
          timestamp: Date.now(),
        })
      }
      if (error.status === 422) {
        throw new AuthErrorC(
          AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
          AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
          {
            message: error.message,
            timestamp: Date.now(),
          },
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
        throw new AuthErrorC(
          AUTH_ERROR.INVALID_CREDENTIALS,
          AUTH_ERROR.INVALID_CREDENTIALS,
          {
            message: error.message,
            timestamp: Date.now(),
          },
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

    const request = await fetch(SUPABASE_URLs.EXGHANGE, {
      method: 'POST',
      headers: {
        apiKey: apiKey!,
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
      throw new SystemError(
        SYSTEM_ERROR.UNKNOWN_ERROR,
        SYSTEM_ERROR.UNKNOWN_ERROR,
        {
          message: error.message,
          timestamp: Date.now(),
        },
      )

    return data as unknown as UserResponse
  }
}
