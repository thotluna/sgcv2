'use server'

import { Result, Session, UserResponse } from '../_auth/types'
import { getLanguageFromCookies } from '@/lib/i18n.utils'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function sendSing<TData>(
  data: TData,
  url: string,
): Promise<Result | void> {
  const cookieStore = await cookies()
  const lang = await getLanguageFromCookies(cookieStore)
  const resp = await getSeccionByCredentials(data, url, lang)
  if (resp.error) return resp.error
  if (!resp.data || !resp.data.session)
    return {
      status: 'error',
      message: 'No se encontro session',
    }
  const { session } = resp.data
  saveAuthCookies(session, cookieStore)
  redirect('/private')
}
async function getSeccionByCredentials<TData>(
  data: TData,
  url: string,
  lang: string,
): Promise<{
  data?: UserResponse
  error?: { status: string; message: string }
}> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': lang,
      },
      body: JSON.stringify(data),
    })
    if (res.status !== 200) {
      const error = await res.json()
      return {
        error: {
          status: error.status,
          message: error.message,
        },
      }
    }
    const userResponse = await res.json()
    return userResponse
  } catch (error) {
    const e = error as Error
    return {
      error: {
        status: 'error',
        message: e.message,
      },
    }
  }
}
function saveAuthCookies(
  session: Session | null,
  cookieStore: ReadonlyRequestCookies,
) {
  if (!session) throw new Error('falta la session')
  const {
    access_token: accessToken,
    expires_in: expiresIn,
    expires_at: expiresAt,
    refresh_token: refreshToken,
  } = session
  cookieStore.delete('access_token')
  cookieStore.delete('refresh_token')
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: expiresIn * 1000,
    expires: expiresAt,
  })
  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  cookieStore.delete('code-verify')
}
