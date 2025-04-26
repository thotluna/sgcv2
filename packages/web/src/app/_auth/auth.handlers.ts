'use server'

import { cookies } from 'next/headers'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL_API}/v1/auth`

export async function validateCustomerCode(code: string) {
  const url = `${BASE_URL}/code/validate`
  const language = (await cookies()).get('NEXT_LOCALE')?.value || 'es'
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': language,
      },
      body: JSON.stringify({ code }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      status: 'error',
      message: error,
    }
  }
}
