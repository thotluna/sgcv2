'use server'

import { cookies } from 'next/headers'
import { Result, SingInDTO, SingUpDTO } from './types'

const URL_API = {
  SIGN_IN: `${process.env.NEXT_PUBLIC_URL_API}/v1/auth/signin`,
  SIGN_UP: `${process.env.NEXT_PUBLIC_URL_API}/v1/auth/singup`,
} as const

export async function singInSubmitHandler(data: SingInDTO): Promise<Result> {
  return sendSing(data, URL_API.SIGN_IN)
}

export async function singUpSubmitHandler(data: SingUpDTO): Promise<Result> {
  return sendSing(data, URL_API.SIGN_IN)
}

async function sendSing<TData>(data: TData, url: string): Promise<Result> {
  try {
    const res = await fetch(url, {
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
    const { session } = result
    const {
      access_token: accessToken,
      expires_in: expiresIn,
      expires_at: expiresAt,
      refresh_token: refreshToken,
      user,
    } = session

    const cookieStore = await cookies()
    cookieStore.set('access-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiresIn * 1000,
      expires: expiresAt,
    })
    cookieStore.set('refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    const { role, email } = user

    cookieStore.set('user', JSON.stringify({ role, email }))

    return { status: 'ok', message: 'ok', data: user }
  } catch (error) {
    console.error(error, 'error en action singin')
    return {
      status: 'fail',
      message: 'error en la conexion. por favor intentelo mas tarde',
    }
  }
}
