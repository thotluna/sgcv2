import { SignInFormSchemaType, SignUpFormSchemaType } from './auth.schemas'

export type SingUpDTO = SignUpFormSchemaType
export type SingInDTO = SignInFormSchemaType

export type Result = {
  status: string
  message: string
  data?: unknown
}

export type Provider = 'google' | 'github' | 'linkedin'
