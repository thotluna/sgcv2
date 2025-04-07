import {
  createClient,
  PostgrestError,
  SupabaseClient,
} from '@supabase/supabase-js'
import { Database } from '../types/database.types'

export class AuthRepository {
  private client: SupabaseClient = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  )

  validateCodeClient = async (codeClient: string): Promise<boolean> => {
    const beforeTime = new Date(Date.now() - 20 * 60 * 60 * 1000)
    const { data, error } = await this.client
      .from('client-code')
      .select('created_at, claimed')
      .eq('code', codeClient)
      .eq('claimed', false)
      .gte('created_at', beforeTime.toISOString())
      .single()

    if (data) return true

    if (error) {
      if (error instanceof PostgrestError) {
        if (error.code === 'PGRST116') {
          return false
        }
      }
      throw new Error('error conexion')
    }
    return false
  }
}
