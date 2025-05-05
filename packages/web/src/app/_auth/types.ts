import { SignInFormSchemaType, SignUpFormSchemaType } from './auth.schemas'

export type SingUpDTO = SignUpFormSchemaType
export type SingInDTO = SignInFormSchemaType
export type Result<T> = {
  status: string
  code?: string
  message?: string
  data?: T
}
export type Provider = 'google' | 'github' | 'linkedin'
export interface User {
  id: string
  email?: string
  created_at: string
  role?: string
}
export interface Session {
  provider_token?: string | null
  provider_refresh_token?: string | null
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: User
}
export type UserResponse =
  | {
      user: User | null
      session: Session | null
    }
  | {
      user: null
      session: null
    }
