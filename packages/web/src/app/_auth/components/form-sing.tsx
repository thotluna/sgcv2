'use client'

import {
  singInSubmitHandler,
  singUpSubmitHandler,
} from '../singSubmitServerAction'
import { Result, SingInDTO, SingUpDTO } from '../types'
import { SingInForm } from './singin-form'
import { SingUpForm } from './singup-form'
import { redirect, useSearchParams } from 'next/navigation'

export function FormSing() {
  const isSingUp = useSearchParams().get('singUp') === 'true'

  const generateSubmitHandler =
    <TData,>(specificSubmitHandler: (data: TData) => Promise<Result>) =>
    async (data: TData): Promise<void> => {
      await specificSubmitHandler(data)
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
