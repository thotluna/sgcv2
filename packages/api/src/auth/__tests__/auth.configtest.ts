import { AuthsRepository, UserResponse } from '../types'

export const authRepository: AuthsRepository = {
  validateCodeClient: jest.fn(),
  signUp: jest.fn(),
  signIn: jest.fn(),
  closeCodeClient: jest.fn(),
  callback: jest.fn(),
  getUser: jest.fn(),
}
export const repositoryValidateCode = {
  resolve: () =>
    (authRepository.validateCodeClient as jest.Mock).mockResolvedValue(true),
  reject: (error: Error) =>
    (authRepository.validateCodeClient as jest.Mock).mockRejectedValue(error),
}

export const authRoute = {
  VALIDATE_CODE: '/v1/auth/code/validate',
  SIGN_UP: '/v1/auth/SIGNup',
  SIGN_IN: '/v1/auth/signin',
  AUTHORIZE: '/v1/auth/authorize',
  CALLBACK: '/v1/auth/callback',
  USER: '/v1/auth/user',
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
    (authRepository.signUp as jest.Mock).mockResolvedValue({
      data,
      error: null,
    }),
  reject: (error: Error) =>
    (authRepository.signUp as jest.Mock).mockRejectedValue(error),
}

export const signInData = {
  email: 'alan@gmail.com',
  password: '12345678',
}

export const repositorySignIn = {
  resolve: () =>
    (authRepository.signIn as jest.Mock).mockResolvedValue({
      data,
      error: null,
    }),
  reject: (error: Error) =>
    (authRepository.signIn as jest.Mock).mockRejectedValue(error),
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

export const dataUser: UserResponse = {
  user: {
    id: '123456789',
    email: signupData.email,
    created_at: Date.now() + '',
    role: 'authenticated',
  },
  session: {
    access_token: '123456789',
    expires_at: Date.now(),
    expires_in: 3600,
    refresh_token: '123456789',
    token_type: 'Bearer',
    user: {
      id: '123456789',
      email: signupData.email,
      created_at: Date.now() + '',
      role: 'authenticated',
    },
  },
}

export const repositoryUser = {
  resolve: (data?: UserResponse | undefined) =>
    (authRepository.getUser as jest.Mock).mockResolvedValue(
      data ? data : dataUser,
    ),
  reject: (error: Error) =>
    (authRepository.getUser as jest.Mock).mockRejectedValue(error),
}
