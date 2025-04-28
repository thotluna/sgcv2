import { UserResponse, CallbackResult } from './types'

export interface AuthRepository {
  saveCustomerCode(token: string, email: string): unknown
  getUser(access_token: string): Promise<UserResponse>
  validateCustomerCode(code: string): Promise<boolean>
  closeCustomerCode(code: string): Promise<boolean>
  signUp(email: string, password: string): Promise<UserResponse>
  signIn(email: string, password: string): Promise<UserResponse>
  callback(code: string, codeVerifier: string): Promise<CallbackResult>
}
