'use server'

import { User } from '../store/store'
import { supabase } from '@/lib/supabase/client'
import { cookies } from 'next/headers'

export async function userSaveAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')
  if (!token) {
    return
  }

  const client = await supabase
  const { data, error } = await client.auth.getUser(token.value)
  if (error || data?.user === null) {
    return
  }
  return data.user as User
}
