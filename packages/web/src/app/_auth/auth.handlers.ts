const BASE_URL = `${process.env.NEXT_PUBLIC_URL_API}/v1/auth`

export async function validateClientCode(clientCode: string) {
  const url = `${BASE_URL}/code/validate`
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientCode,
      }),
    })

    const data = await response.json()

    console.log({ data }, 'authHandler validateClientCode')

    return data
  } catch (error) {
    return {
      status: 'fail',
      message: error,
    }
  }
}
