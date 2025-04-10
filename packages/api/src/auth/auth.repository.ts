import { type Database } from '@sgcv2/shared'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { AuthError, DBErrorConexion } from './errors'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

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
      password: bcrypt.hashSync(password, SALT_ROUNDS),
    }

    const { error, data } = await this.client.auth.signUp(singUpData)

    if (error) {
      if (error.status === 422) {
        throw new AuthError('El email ya esta registrado')
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
}
