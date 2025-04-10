import { cookies } from 'next/headers'

export default function Auth() {
  const validateCredentials = async () => {
    'use server'

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/v1/auth/check-session`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Autorization: `Bearer ${accessToken?.value}`,
        },
      },
    )
    const data = await response.json()
    console.log(data)
  }

  validateCredentials()
}
