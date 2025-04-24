'use client'

import {
  singInSubmitHandler,
  singUpSubmitHandler,
} from '../signSubmitServerAction'
import { Result, SingInDTO, SingUpDTO } from '../types'
import { SingInForm } from './signin-form'
import { SingUpForm } from './signup-form'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'

export function FormSing({ isSingUp }: { isSingUp?: boolean | undefined }) {
  const generateSubmitHandler =
    <TData,>(specificSubmitHandler: (data: TData) => Promise<Result>) =>
    async (data: TData): Promise<void> => {
      const res = await specificSubmitHandler(data)

      if (res.status === 'error') {
        toast.error(res.message)
      }

      redirect('/')
    }

  const singInHandler = generateSubmitHandler<SingInDTO>(singInSubmitHandler)
  const singUpHandler = generateSubmitHandler<SingUpDTO>(singUpSubmitHandler)

  return isSingUp ? (
    <SingUpForm onSubmit={singUpHandler} />
  ) : (
    <SingInForm onSubmit={singInHandler} />
  )
}
