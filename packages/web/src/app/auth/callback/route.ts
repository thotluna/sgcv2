import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get('sr-sb-access_token')
  const refreshToken = cookieStore.get('sr-sb-refresh_token')

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect('http://localhost:3000')
  }

  cookieStore.delete('sb-rzfvzqhceahqpjzjswxz-auth-code-verify')

  const client = createClient()
  const result = await (
    await client
  ).auth.setSession({
    access_token: accessToken!.value,
    refresh_token: refreshToken!.value,
  })
  console.log(result.data.user)

  return NextResponse.redirect('http://localhost:3000/private')
}
