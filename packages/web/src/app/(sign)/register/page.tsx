'use client'

import { useAuthSubmit } from '../useAuthSubmit'
import { SingUpForm } from '@/app/(sign)/register/signup-form'
import { SingUpDTO } from '@/app/_auth/types'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

const URL_API = {
  SIGN_UP: `${process.env.NEXT_PUBLIC_URL_API}/v1/auth/signup`,
} as const

export default function Register() {
  const traslateRegisterPage = useTranslations('RegisterPage')
  const handler = useAuthSubmit<SingUpDTO>({
    url: URL_API.SIGN_UP,
    onError: message => {
      toast.error(traslateRegisterPage(message))
    },
  })

  return <SingUpForm onSubmit={handler} />
}
