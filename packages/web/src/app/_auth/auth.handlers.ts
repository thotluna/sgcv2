'use server'

import { cookies } from 'next/headers'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL_API}/v1/auth`

export async function validateClientCode(clientCode: string) {
  const url = `${BASE_URL}/code/validate`
  const language = (await cookies()).get('NEXT_LOCALE')?.value || 'es'
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': language,
      },
      body: JSON.stringify({
        clientCode,
      }),
    })

    const data = await response.json()
    console.log({ data }, 'handler')
    return data
  } catch (error) {
    return {
      status: 'error',
      message: error,
    }
  }
}
