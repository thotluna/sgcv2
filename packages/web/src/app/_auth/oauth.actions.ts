'use server'
import { type Provider } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
// import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// const signInWith = (provider: Provider) => async () => {
//   const client = await createClient()
//   const authCallbackUrl = `${process.env.NEXT_PUBLIC_URL_API}/v1/auth/callback`
//   const authCallbackUrl = `http://localhost:3000/auth/callback`

//   const { data } = await client.auth.signInWithOAuth({
//     provider,
//     options: {
//       redirectTo: authCallbackUrl,
//     },
//   })

//   if (data.url) {
//     redirect(data.url) // use the redirect API for your server framework
//   }
// }

const signInWith = (provider: Provider) => async () => {
  const url = new URL(`${process.env.NEXT_PUBLIC_URL_API}/v1/auth/authorize`)
  url.searchParams.append('provider', provider)

  const response = await fetch(url.toString())

  const body = await response.json()
  const { data } = body

  if (data.codeVerifier) {
    const cookieStore = await cookies()
    cookieStore.set(
      'sb-rzfvzqhceahqpjzjswxz-auth-code-verify',
      data.codeVerifier,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    )
  }

  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  }
}

export const signInWithGoogle = signInWith('google')

export const signInWithLinkedin = signInWith('linkedin')
