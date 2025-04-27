import { useSubmitHandler } from '../useSubmitHandler'
import { SingUpForm } from '@/app/(sign)/register/signup-form'
import { SingUpDTO } from '@/app/_auth/types'

const URL_API = {
  SIGN_UP: `${process.env.NEXT_PUBLIC_URL_API}/v1/auth/signup`,
} as const

export default function Register() {
  const handler = useSubmitHandler<SingUpDTO>(URL_API.SIGN_UP)

  return <SingUpForm onSubmit={handler} />
}
