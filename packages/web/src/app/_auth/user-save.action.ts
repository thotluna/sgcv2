'use server'

import { getUser } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function userSaveAction() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')

  if (!accessToken) {
    return null
  }

  try {
    return await getUser(accessToken.value)
  } catch {
    return null
  }
}
