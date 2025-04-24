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

  /**
   * Check if the code client is valid
   *
   * @param codeClient string
   * @returns Promise<boolean>
   */
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
        throw new AuthError('Codigo de cliente no válido')
      }

      if (error.message === 'TypeError: fetch failed') {
        throw new DBErrorConexion(
          'Ups... hemos tenido un problema. Por favor inténtelo más tarde',
        )
      }
    }

    return true
  }

  /**
   * Sign up the user
   *
   * @param email Email of the user
   * @param password Password of the user
   * @returns Promise<boolean>
   */
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
        throw new AuthError('error en el codigo del cliente')
      }
      if (error.status === 422) {
        throw new AuthError('El email ya esta registrado')
      }
    }
    return data
  }

  /**
   * Sign in the user
   *
   * @param email Email of the user
   * @param password Password of the user
   * @returns Promise<boolean>
   */
  signIn = async (email: string, password: string) => {
    const signInData = {
      email,
      password,
    }

    const { error, data } =
      await this.client.auth.signInWithPassword(signInData)

    if (error) {
      if (error.status === 400) {
        throw new AuthError('El email o la contraseña no son validos')
      }
    }

    return data
  }

  /**
   * Borrar el codigo de cliente del sistema
   *
   * @param codeClient Code client
   * @returns Promise<boolean>
   */
  closeCodeClient = async (codeClient: string) => {
    const { error } = await this.client
      .from('clientcode')
      .update({ claimed: true })
      .eq('code', codeClient)
      .eq('claimed', false)
      .single()

    return error === null
  }

  /**
   * Get the authorization URL
   *
   * @param code string code authentification
   * @param codeVerifier string code original of code challenge
   * @returns Promise<string>
   */
  async callback(code: string, codeVerifier: string) {
    const { SUPABASE_ANON_KEY: apiKey } = process.env

    if (apiKey === undefined) {
      throw new AuthError('No se ha encontrado la clave anonima')
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
      throw new AuthError(error as string)
    }
  }

  async getUser(access_token: string) {
    const { data, error } = await this.client.auth.getUser(access_token)
    if (error) throw new AuthError(error.message)

    return data as unknown as UserResponse
  }
}
