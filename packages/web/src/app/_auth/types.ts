import { SingInFormSchema, SingUpFormEntity } from './auth.schemas'
import { z } from 'zod'

export type SingUpDTO = z.infer<typeof SingUpFormEntity>
export type SingInDTO = z.infer<typeof SingInFormSchema>

export type Result = {
  status: string
  message: string
  data?: unknown
}

export type Provider = 'google' | 'github' | 'linkedin'
