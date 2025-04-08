import { z } from 'zod'
import { SingUpFormEntity } from './auth.schemas'

export type SingUpDTO = z.infer<typeof SingUpFormEntity>
