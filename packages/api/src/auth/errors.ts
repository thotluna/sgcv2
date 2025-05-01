import { errorClassFactory } from '@sgcv2/shared'

export const VALIDATION_ERROR = {
  EMAIL_REQUIRED: 'email_required',
  EMAIL_INVALID: 'email_invalid',
  PASSWORD_MIN_LENGTH: 'password_min_length',
  PASSWORD_MAX_LENGTH: 'password_max_length',
} as const

export const AUTH_ERROR = {
  EMAIL_ALREADY_REGISTERED: 'auth_email_already_registed',
  INVALID_CREDENTIALS: 'invalid_credentials',
  TOKEN_REQUIRED: 'token_required',
  TOKEN_EXPIRED: 'token_expired',
  TOKEN_INVALID: 'token_invalid',
  TOKEN_MALFORMED: 'jwt_malformed',
  CLIENT_CODE_REQUIRED: 'client_code_required',
  CODE_NOT_FOUND: 'code_not_found',
  NOT_FOUND_ANONYMOUS_KEY: 'not_found_anonymous_key',
  INVALID_CODE: 'Invalid_code',
} as const

export const SYSTEM_ERROR = {
  UNKNOWN_ERROR: 'unknown_error',
} as const

export const PROVIDER_ERROR = {
  PROVIDER_INVALID: 'provider_invalid',
} as const

export const ValidationError = errorClassFactory('ValidationError', 400)
export const AuthErrorC = errorClassFactory('AuthError', 401)
export const SystemError = errorClassFactory('SystemError', 500)
export const ProviderError = errorClassFactory('ProviderError', 500)
export const TokenError = errorClassFactory('CustomerCodeError', 401)
