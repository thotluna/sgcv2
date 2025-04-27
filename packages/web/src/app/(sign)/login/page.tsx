'use client'

import { useSubmitHandler } from '../useSubmitHandler'
import { SingInForm } from '@/app/_auth/components/signin-form'
import { SingInDTO } from '@/app/_auth/types'

const URL_API = {
  SIGN_IN: `${process.env.NEXT_PUBLIC_URL_API}/v1/auth/signin`,
} as const

export default function Login() {
  const handler = useSubmitHandler<SingInDTO>(URL_API.SIGN_IN)

  return <SingInForm onSubmit={handler} />
}
