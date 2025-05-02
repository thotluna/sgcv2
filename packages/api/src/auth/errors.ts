import { errorClassFactory } from '@api/errors/errors'
import { HttpCodeType } from '@sgcv2/shared'

export const VALIDATION_ERROR = {
  EMAIL_REQUIRED: 'email_required',
  EMAIL_INVALID: 'email_invalid',
  PASSWORD_MIN_LENGTH: 'password_min_length',
  PASSWORD_MAX_LENGTH: 'password_max_length',
} as const
export const AUTH_ERROR = {
  EMAIL_ALREADY_REGISTERED: 'auth_email_already_registered',
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
export const AuthError = errorClassFactory('AuthError', 401 as HttpCodeType)
export const ProviderError = errorClassFactory(
  'ProviderError',
  500 as HttpCodeType,
)
export const TokenError = errorClassFactory(
  'CustomerCodeError',
  401 as HttpCodeType,
)
