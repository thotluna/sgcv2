'use server'

import { cookies } from 'next/headers'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL_API}/v1/auth`

export async function validateCustomerCode(code: string) {
  const url = `${BASE_URL}/code/validate`
  const language = await getLanguage()
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
    // console.log('[validateCustomerCode]', { status: response.status, data })
    return data
  } catch (error) {
    // console.log('[validateCustomerCode][error]', error)
    return {
      status: 'error',
      message: error,
    }
  }
}

async function getLanguage() {
  try {
    const language = (await cookies()).get('NEXT_LOCALE')?.value || 'es'
    return language
  } catch {
    return 'es'
  }
}
