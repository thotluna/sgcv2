import { User } from '@/app/store/store'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function getUser(token: string | undefined) {
  if (!token) return null

  const { data } = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/v1/auth/user`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  ).then(res => res.json())

  if (!data) {
    throw new Error('No se ha encontrado el usuario')
  }

  return data?.user as User
}

export async function updateAuthSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })

  const cookiesStrore = await cookies()
  const accessToken = cookiesStrore.get('access_token')

  const user = await getUser(accessToken?.value)

  console.log({
    user: !user,
    login: !request.nextUrl.pathname.startsWith('/login'),
    auth: !request.nextUrl.pathname.startsWith('/auth'),
    root: request.nextUrl.pathname !== '/',
  })

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    request.nextUrl.pathname !== '/'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (user && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/private'
    return NextResponse.redirect(url)
  }

  return response
}
