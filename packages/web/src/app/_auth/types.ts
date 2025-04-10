import { z } from 'zod'
import { SingInFormSchema, SingUpFormEntity } from './auth.schemas'

export type SingUpDTO = z.infer<typeof SingUpFormEntity>
export type SingInDTO = z.infer<typeof SingInFormSchema>

export type Result = {
  status: string
  message: string
  data?: unknown
}
