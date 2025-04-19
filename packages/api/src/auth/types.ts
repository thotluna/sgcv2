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

export type AuthResponse =
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

export interface AuthsRepository {
  validateCodeClient(codeClient: string): Promise<boolean>
  singUp(email: string, password: string): Promise<AuthResponse>
  singIn(email: string, password: string): Promise<AuthResponse>
  closeCodeClient(codeClient: string): Promise<boolean>
  checkSession(token: string): Promise<{ user: User | null }>
  callback(code: string, codeVerifier: string): Promise<CallbackResult>
}
