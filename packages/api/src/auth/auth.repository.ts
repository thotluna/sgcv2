import { type Database } from '@sgcv2/shared'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { AuthError, DBErrorConexion } from './errors'

export const SUPABASE_URLs = {
  AUTHORIZATION: `${process.env.SUPABASE_URL}/auth/v1/authorize`,
  EXGHANGE: `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=pkce`,
} as const

interface CallbackResult {
  access_token: string
  expires_at: number
  refresh_token: string
}

export class AuthRepository {
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
  validateCodeClient = async (codeClient: string): Promise<boolean> => {
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
  singUp = async (email: string, password: string) => {
    const singUpData = {
      email,
      password,
    }

    const { error, data } = await this.client.auth.signUp(singUpData)

    if (error) {
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
  singIn = async (email: string, password: string) => {
    const singInData = {
      email,
      password,
    }

    const { error, data } =
      await this.client.auth.signInWithPassword(singInData)

    if (error) {
      if (error.status === 401) {
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
   * Check if the token is valid
   *
   * @param token Token
   * @returns Promise<boolean>
   */
  async checkSession(token: string) {
    const { error, data } = await this.client.auth.getUser(token)

    if (error) {
      if (error.status === 403) {
        throw new AuthError('Token no valido')
      }
    }

    return data
  }

  /**
   * Get the authorization URL
   *
   * @param code string code authentification
   * @param codeVerifier string code original of code challenge
   * @returns Promise<string>
   */
  async callback(code: string, codeVerifier: string): Promise<CallbackResult> {
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
}
