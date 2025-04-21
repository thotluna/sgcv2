import { AuthsRepository } from '../types'
import { ApiResponse } from '@sgcv2/shared'

export const authRepository: AuthsRepository = {
  validateCodeClient: jest.fn(),
  singUp: jest.fn(),
  singIn: jest.fn(),
  closeCodeClient: jest.fn(),
  checkSession: jest.fn(),
  callback: jest.fn(),
}
export const repositoryValidateCode = {
  resolve: () =>
    (authRepository.validateCodeClient as jest.Mock).mockResolvedValue(true),
  reject: (error: Error) =>
    (authRepository.validateCodeClient as jest.Mock).mockRejectedValue(error),
}

export const authRoute = {
  VALIDATE_CODE: '/v1/auth/code/validate',
  SING_UP: '/v1/auth/singup',
  SING_IN: '/v1/auth/signin',
}

export const clientCode = {
  correct: '123!@#&*-456789aB-cDeFgHiJ-kLmNoPqR',
  incorrect: 'code invalid',
}

export class AuthResponseBuilder<T> {
  private response: ApiResponse<T> = {
    status: 'success',
    code: 200,
  }

  status(status: 'success' | 'error') {
    this.response.status = status
    return this
  }
  data(data: T) {
    this.response.data = data
    return this
  }
  message(message: string) {
    this.response.message = message
    return this
  }
  code(code: number) {
    this.response.code = code
    return this
  }
  metadata(metadata: object) {
    this.response.metadata = metadata
    return this
  }
  build(): ApiResponse<T> {
    return this.response
  }
}
