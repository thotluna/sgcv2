import { SingUpDTO } from './types'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL_API}/v1/auth`

export async function validateClientCode(clientCode: string) {
  const url = `${BASE_URL}/code/validate`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientCode,
    }),
  })
  if (!response.ok) {
    const error = await response.json()
    console.warn(error.message)
    return {
      status: error.status,
      message: error.message,
    }
  }
  return response.json()
}

export async function singUpSubmitHandler(data: SingUpDTO) {
  console.log(data)
}
