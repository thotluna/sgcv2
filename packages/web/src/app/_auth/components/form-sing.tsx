'use client'
import { SingInForm } from './singin-form'
import { SingUpForm } from './singup-form'
import { redirect, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Result, SingInDTO, SingUpDTO } from '../types'
import {
  singInSubmitHandler,
  singUpSubmitHandler,
} from '../singSubmitServerAction'
import cookies from 'js-cookie'
import { useStoreState } from '@/app/store/store'
export function FormSing() {
  const setUser = useStoreState(state => state.setUser)
  const isSingUp = useSearchParams().get('singUp') === 'true'

  const generateSubmitHandler =
    <TData,>(specificSubmitHandler: (data: TData) => Promise<Result>) =>
    async (data: TData): Promise<void> => {
      const response = await specificSubmitHandler(data)

      if (response.status === 'ok') {
        const userRow = cookies.get('user')
        if (userRow) {
          const user = JSON.parse(userRow)
          setUser(user)
        }

        redirect('/auth')
      } else if (response.status === 'fail') {
        toast.error(response.message || 'Ocurrió un error desconocido.')
      } else {
        toast.warning(`Estado de respuesta inesperado: ${response.status}`)
      }
    }

  const singInHandler = generateSubmitHandler<SingInDTO>(singInSubmitHandler)
  const singUpHandler = generateSubmitHandler<SingUpDTO>(singUpSubmitHandler)

  return isSingUp ? (
    <SingUpForm onSubmit={singUpHandler} />
  ) : (
    <SingInForm onSubmit={singInHandler} />
  )
}
