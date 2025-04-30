export interface ApiResponse<T> {
  data?: T
  status: 'success' | 'error'
  httpCode?: number
  message?: string | null
  code: number | string | null
  metadata?: object | null
}

export * from './database.types'
export * from './clients.types'

export interface ApiResponses<T, E = ErrorDetail> {
  data?: T
  status: 'success' | 'error'
  httpCode: number
  message: string
  code: ErrorCode
  metadata?: Record<string, unknown>
  errors?: E[]
  timestamp: string
  traceId?: string
}

interface ErrorDetail {
  code: string
  message: string
  field?: string
  details?: Record<string, unknown>
}

enum ErrorCode {
  SUCCESS = 0,
  VALIDATION_ERROR = 400,
  AUTH_ERROR = 401,
  // Otros códigos de error
}
