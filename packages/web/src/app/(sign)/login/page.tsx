'use client'

import { useAuthSubmit } from '../useAuthSubmit'
import { SingInForm } from '@/app/(sign)/login/signin-form'
import { SingInDTO } from '@/app/_auth/types'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const URL_API = {
  SIGN_IN: `${process.env.NEXT_PUBLIC_URL_API}/v1/auth/signin`,
} as const

export default function Login() {
  const traslateRegisterPage = useTranslations('validation')
  const router = useRouter()
  const handler = useAuthSubmit<SingInDTO>({
    url: URL_API.SIGN_IN,
    onError: message => {
      toast.error(traslateRegisterPage(message))
    },
    onSuccess: () => router.push('/private'),
  })

  return <SingInForm onSubmit={handler} />
}
