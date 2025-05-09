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
export interface CallbackResult {
  access_token: string
  expires_at: number
  refresh_token: string
}
export interface authorizeDataType {
  codeVerifier: string
  url: string
}
