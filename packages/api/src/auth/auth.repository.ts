import { type Database } from '@sgcv2/shared'
import {
  AuthTokenResponsePassword,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js'
import { AuthError, DBErrorConexion } from './errors'
import { generatePKCEParams } from './oauth'

export const SUPABASE_URLs = {
  AUTHORIZATION: `${process.env.SUPABASE_URL}/auth/v1/authorize`,
  EXGHANGE: `${process.env.SUPABASE_URL}/auth/v1//token?grant_type=pkce`,
} as const

export class AuthRepository {
  private client: SupabaseClient = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROL!,
  )

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

  closeCodeClient = async (codeClient: string) => {
    const { error } = await this.client
      .from('clientcode')
      .update({ claimed: true })
      .eq('code', codeClient)
      .eq('claimed', false)
      .single()

    return error === null
  }

  async checkSession(token: string) {
    const { error, data } = await this.client.auth.getUser(token)

    if (error) {
      console.error(error, 'error repository')
      if (error.status === 403) {
        throw new AuthError('Token no valido')
      }
    }

    return data
  }

  async authorize() {
    const conf: Record<string, string> = {
      provider: 'google',
      redirect_to: 'http://localhost:3000',
      code_challenge: (await generatePKCEParams()).codeChallenge,
      code_challenge_method: 'S256',
    }

    const uri = new URL(SUPABASE_URLs.AUTHORIZATION)

    Object.keys(conf).forEach(key => {
      uri.searchParams.append(key, conf[key])
    })

    return uri.toString()
  }

  async callback(code: string, codeVerifier: string) {
    const { SUPABASE_ANON_KEY } = process.env

    const headers = new Headers()
    headers.append('api-key', SUPABASE_ANON_KEY!)
    headers.append('Authorization', `Bearer ${SUPABASE_ANON_KEY!}`)
    headers.append('Content-Type', 'application/json')

    console.log({ headers })

    const res = await fetch(SUPABASE_URLs.EXGHANGE, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        auth_code: code,
        code_verifier: codeVerifier,
      }),
    }).then(response => response.json())

    const { data, error } = res as AuthTokenResponsePassword

    return { data, error }
  }
}
