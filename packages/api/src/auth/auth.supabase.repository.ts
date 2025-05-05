import { SystemError } from '@api/errors/system-error'
import type { CallbackResult, UserResponse } from '@auth'
import {
  SUPABASE_URLs,
  AuthRespository,
  SYSTEM_ERROR,
  AuthError,
  AUTH_ERROR
} from '@auth'
import { Database } from '@sgcv2/shared'
import { SupabaseClient, createClient } from '@supabase/supabase-js'

export class SupabaseAuthRepository implements AuthRespository {
  private client: SupabaseClient = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROL!
  )
  saveCustomerCode = async (token: string, email: string) => {
    const { data, error } = await this.client
      .from('clientcode')
      .insert([{ code: token, email }])
      .select()
    if (error) {
      throw new SystemError({
        code: SYSTEM_ERROR.UNKNOWN_ERROR,
        message: SYSTEM_ERROR.UNKNOWN_ERROR,
        details: {
          message: error.message,
          timestamp: Date.now()
        }
      })
    }
    return data
  }
  validateCustomerCode = async (code: string) => {
    const { error } = await this.client
      .from('clientcode')
      .select('created_at, claimed')
      .eq('code', code)
      .eq('claimed', false)
      .single()
    if (error) {
      if (error.code === 'PGRST116') {
        throw new AuthError({
          code: AUTH_ERROR.CODE_NOT_FOUND,
          message: AUTH_ERROR.CODE_NOT_FOUND,
          details: {
            message: error.message,
            timestamp: Date.now()
          }
        })
      }
      throw new SystemError({
        code: SYSTEM_ERROR.UNKNOWN_ERROR,
        message: SYSTEM_ERROR.UNKNOWN_ERROR,
        details: {
          message: error.message,
          timestamp: Date.now()
        }
      })
    }
    return true
  }
  signUp = async (email: string, password: string) => {
    const signUpData = {
      email,
      password
    }
    const { data, error } = await this.client.auth.signUp(signUpData)
    if (error) {
      if (
        error.name === 'AuthApiError' &&
        error.message === 'Database error saving new user'
      ) {
        throw new AuthError({
          code: AUTH_ERROR.INVALID_CODE,
          message: AUTH_ERROR.INVALID_CODE,
          details: {
            message: error.message,
            timestamp: Date.now()
          }
        })
      }
      if (error.status === 422) {
        throw new AuthError({
          code: AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
          message: AUTH_ERROR.EMAIL_ALREADY_REGISTERED,
          details: {
            message: error.message,
            timestamp: Date.now()
          }
        })
      }
    }
    return data
  }
  signIn = async (email: string, password: string) => {
    const signInData = {
      email,
      password
    }
    const { error, data } =
      await this.client.auth.signInWithPassword(signInData)
    if (error) {
      if (error.status === 400) {
        throw new AuthError({
          code: AUTH_ERROR.INVALID_CREDENTIALS,
          message: AUTH_ERROR.INVALID_CREDENTIALS,
          details: {
            message: error.message,
            timestamp: Date.now()
          }
        })
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
    const request = await fetch(
      `${process.env.SUPABASE_URL!}${SUPABASE_URLs.EXGHANGE}`,
      {
        method: 'POST',
        headers: {
          apiKey: apiKey!,
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          auth_code: code,
          code_verifier: codeVerifier
        })
      }
    ).then(result => result.json())
    return request as CallbackResult
  }
  async getUser(access_token: string) {
    const { data, error } = await this.client.auth.getUser(access_token)
    if (error)
      throw new SystemError({
        code: SYSTEM_ERROR.UNKNOWN_ERROR,
        message: SYSTEM_ERROR.UNKNOWN_ERROR,
        details: {
          message: error.message,
          timestamp: Date.now()
        }
      })
    return data as unknown as UserResponse
  }
  resetMock(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
