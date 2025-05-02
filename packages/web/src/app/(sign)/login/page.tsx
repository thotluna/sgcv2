'use client'

import { useAuthSubmit } from '../useAuthSubmit'
import { SingInForm } from '@/app/(sign)/login/signin-form'
import { SingInDTO } from '@/app/_auth/types'

const URL_API = {
  SIGN_IN: `${process.env.NEXT_PUBLIC_URL_API}/v1/auth/signin`,
} as const

export default function Login() {
  const handler = useAuthSubmit<SingInDTO>(URL_API.SIGN_IN)

  return <SingInForm onSubmit={handler} />
}
