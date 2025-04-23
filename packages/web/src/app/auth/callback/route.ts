// import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log({ request })

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')

  if (!accessToken) {
    return NextResponse.redirect('http://localhost:3000')
  }

  cookieStore.delete('code-verify')

  return NextResponse.redirect('http://localhost:3000/private')
}
