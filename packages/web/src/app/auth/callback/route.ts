import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log({ request })

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')

  if (!accessToken) {
    const url = request.nextUrl.clone()
    url.pathname = '/register'
    return NextResponse.redirect(url)
  }

  cookieStore.delete('code-verify')
  const url = request.nextUrl.clone()
  url.pathname = '/private'
  return NextResponse.redirect(url)
}
