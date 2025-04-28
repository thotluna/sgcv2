import { AuthRespository, UserResponse } from '@auth'
import { CustomerCodeJwtHelper } from '@utils'

export const authRepositoryMock: AuthRespository = {
  saveCustomerCode: jest.fn(),
  validateCustomerCode: jest.fn(),
  signUp: jest.fn(),
  signIn: jest.fn(),
  closeCustomerCode: jest.fn(),
  callback: jest.fn(),
  getUser: jest.fn(),
}
export const repositoryValidateCode = {
  resolve: () =>
    (authRepositoryMock.validateCustomerCode as jest.Mock).mockResolvedValue(
      true,
    ),
  reject: (error: Error) =>
    (authRepositoryMock.validateCustomerCode as jest.Mock).mockRejectedValue(
      error,
    ),
}

export const authRoute = {
  VALIDATE_CODE: '/v1/auth/code/validate',
  SIGN_UP: '/v1/auth/signup',
  SIGN_IN: '/v1/auth/signin',
  AUTHORIZE: '/v1/auth/authorize',
  CALLBACK: '/v1/auth/callback',
  USER: '/v1/auth/user',
}

export const clientCode = {
  correct: new CustomerCodeJwtHelper().crearToken('qw@qw.co'),
  incorrect: 'code invalid',
}

export const signupData = {
  email: 'alan@gmail.com',
  password: '12345678',
  code: new CustomerCodeJwtHelper().crearToken('alan@gmail.com'),
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
    (authRepositoryMock.signUp as jest.Mock).mockResolvedValue({
      data,
      error: null,
    }),
  reject: (error: Error) =>
    (authRepositoryMock.signUp as jest.Mock).mockRejectedValue(error),
}

export const signInData = {
  email: 'alan@gmail.com',
  password: '12345678',
}

export const repositorySignIn = {
  resolve: () =>
    (authRepositoryMock.signIn as jest.Mock).mockResolvedValue({
      data,
      error: null,
    }),
  reject: (error: Error) =>
    (authRepositoryMock.signIn as jest.Mock).mockRejectedValue(error),
}

export const repositoryCallback = {
  resolve: () =>
    (authRepositoryMock.callback as jest.Mock).mockResolvedValue({
      access_token: '123456789',
      expires_at: Date.now(),
      refresh_token: '123456789',
    }),
  reject: (error: Error) =>
    (authRepositoryMock.callback as jest.Mock).mockRejectedValue(error),
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
    (authRepositoryMock.getUser as jest.Mock).mockResolvedValue(
      data ? data : dataUser,
    ),
  reject: (error: Error) =>
    (authRepositoryMock.getUser as jest.Mock).mockRejectedValue(error),
}
