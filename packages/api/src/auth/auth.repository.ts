import { type Database } from '@sgcv2/shared'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { AuthError, DBErrorConexion } from './errors'

export class AuthRepository {
  private client: SupabaseClient = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROL!,
  )

  validateCodeClient = async (codeClient: string): Promise<boolean> => {
    const beforeTime = new Date(Date.now() - 48 * 60 * 60 * 1000)

    const { error, data } = await this.client
      .from('client-code')
      .select('created_at, claimed')
      .eq('code', codeClient)
      .eq('claimed', false)
      .gte('created_at', beforeTime.toISOString())
      .single()

    console.log({ error, data })

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('entrando a PGRST116')
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
}
