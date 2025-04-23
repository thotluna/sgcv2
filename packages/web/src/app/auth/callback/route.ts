import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get('access_token')
  const refreshToken = cookieStore.get('refresh_token')

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect('http://localhost:3000')
  }

  cookieStore.delete('code-verify')

  const client = await createClient()
  await client.auth.setSession({
    access_token: accessToken!.value,
    refresh_token: refreshToken!.value,
  })

  return NextResponse.redirect('http://localhost:3000/private')
}
