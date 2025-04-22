import { AuthsRepository } from '../types'

export const authRepository: AuthsRepository = {
  validateCodeClient: jest.fn(),
  singUp: jest.fn(),
  singIn: jest.fn(),
  closeCodeClient: jest.fn(),
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
  AUTHORIZE: '/v1/auth/authorize',
  CALLBACK: '/v1/auth/callback',
}

export const clientCode = {
  correct: '123!@#&*-456789aB-cDeFgHiJ-kLmNoPqR',
  incorrect: 'code invalid',
}

export const signupData = {
  email: 'alan@gmail.com',
  password: '12345678',
  clientCode: '123!@#&*-456789aB-cDeFgHiJ-kLmNoPqR',
}

export const data = {
  user: {
    id: '123456789',
    email: signupData.email,
    created_at: Date.now(),
    role: 'authenticated',
  },
  session: {
    provider_token: 'password',
  },
}

export const repositorySignUp = {
  resolve: () =>
    (authRepository.singUp as jest.Mock).mockResolvedValue({
      data,
      error: null,
    }),
  reject: (error: Error) =>
    (authRepository.singUp as jest.Mock).mockRejectedValue(error),
}

export const signInData = {
  email: 'alan@gmail.com',
  password: '12345678',
}

export const repositorySignIn = {
  resolve: () =>
    (authRepository.singIn as jest.Mock).mockResolvedValue({
      data,
      error: null,
    }),
  reject: (error: Error) =>
    (authRepository.singIn as jest.Mock).mockRejectedValue(error),
}

export const repositoryCallback = {
  resolve: () =>
    (authRepository.callback as jest.Mock).mockResolvedValue({
      access_token: '123456789',
      expires_at: Date.now(),
      refresh_token: '123456789',
    }),
  reject: (error: Error) =>
    (authRepository.callback as jest.Mock).mockRejectedValue(error),
}
