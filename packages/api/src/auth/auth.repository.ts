import { UserResponse, CallbackResult } from '@auth'

export interface AuthRespository {
  saveCustomerCode(token: string, email: string): unknown
  getUser(access_token: string): Promise<UserResponse>
  validateCustomerCode(code: string): Promise<boolean>
  closeCustomerCode(code: string): Promise<boolean>
  signUp(email: string, password: string): Promise<UserResponse>
  signIn(email: string, password: string): Promise<UserResponse>
  callback(code: string, codeVerifier: string): Promise<CallbackResult>
}
