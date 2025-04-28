import { AuthRepository } from '../auth.repository'
import { UserResponse, CallbackResult } from '../types'
import { assert } from 'console'

export class AuthMockRepository implements AuthRepository {
  saveCustomerCode(token: string, email: string): unknown {
    assert(token, email)
    throw new Error('Method not implemented.')
  }
  getUser(access_token: string): Promise<UserResponse> {
    assert(access_token)
    throw new Error('Method not implemented.')
  }
  validateCustomerCode(code: string): Promise<boolean> {
    assert(code)
    throw new Error('Method not implemented.')
  }
  closeCustomerCode(code: string): Promise<boolean> {
    assert(code)
    throw new Error('Method not implemented.')
  }
  signUp(email: string, password: string): Promise<UserResponse> {
    assert(email, password)
    throw new Error('Method not implemented.')
  }
  signIn(email: string, password: string): Promise<UserResponse> {
    assert(email, password)
    throw new Error('Method not implemented.')
  }
  callback(code: string, codeVerifier: string): Promise<CallbackResult> {
    assert(code, codeVerifier)
    throw new Error('Method not implemented.')
  }
}
