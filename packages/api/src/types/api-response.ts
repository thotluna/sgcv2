import { ErrorDetail } from '@api/errors/errors'
import { HTTP_CODE, HttpCodeType } from '@sgcv2/shared'

export const STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const
export interface ApiResponse<T, E = ErrorDetail> {
  data?: T | undefined
  status: (typeof STATUS)[keyof typeof STATUS]
  httpCode: HttpCodeType
  message?: string
  metadata?: Record<string, unknown> | undefined
  errors?: E[]
  timestamp: string
}
export class ApiResponseBuilder<T, E = ErrorDetail | null> {
  private response: ApiResponse<T, E> = {
    status: STATUS.SUCCESS,
    httpCode: HTTP_CODE.OK,
    errors: [],
    timestamp: new Date().toISOString(),
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
  httpCode(httpCode: HttpCodeType) {
    this.response.httpCode = httpCode
    return this
  }
  errors(errors: E[] | E) {
    if (Array.isArray(errors)) {
      this.response.errors = errors
    } else {
      this.response.errors = this.response.errors
        ? [...this.response.errors, errors]
        : [errors]
    }
    return this
  }
  metadata(metadata: Record<string, unknown>) {
    this.response.metadata = metadata
    return this
  }
  setTimestamp(timeStamp: string) {
    this.response.timestamp = timeStamp
    return this
  }
  build(): ApiResponse<T, E> {
    return this.response
  }
}
