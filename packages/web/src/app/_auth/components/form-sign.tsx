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

interface Prop {
  isSingUp?: boolean | undefined
}

export type SubmitHandler<TData> = (data: TData) => Promise<Result>

export function FormSign({ isSingUp }: Prop) {
  const generateSubmitHandler =
    <TData,>(submitHandler: SubmitHandler<TData>) =>
    async (data: TData): Promise<void> => {
      const res = await submitHandler(data)

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
