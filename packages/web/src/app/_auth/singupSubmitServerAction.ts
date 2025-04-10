'use server'

import { cookies } from 'next/headers'
import { SingUpDTO } from './types'

export async function singUpSubmitHandler(data: SingUpDTO) {
  const URL_API = `${process.env.NEXT_PUBLIC_URL_API}/v1/auth/singup`

  try {
    const res = await fetch(URL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (res.status !== 200) {
      const error = await res.json()
      console.warn(res.status, res.statusText, error.message)
      return {
        status: error.status,
        message: error.message,
      }
    }

    const { data: result } = await res.json()
    const { user, session } = result
    const {
      access_token: accessToken,
      expires_in: expiresIn,
      expires_at: expiresAt,
      refresh_token: refreshToken,
    } = session

    const cookieStore = await cookies()
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiresIn * 1000,
      expires: expiresAt,
    })
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return { status: 'ok', message: 'ok', data: user }
  } catch (error) {
    console.log(error, 'este es en el catch del submit')
  }
}
