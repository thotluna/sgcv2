import { HttpCodeType } from '@sgcv2/shared'

export interface BusinessErrorShape {
  code: string
  message: string
  httpCode?: number
}

export const createErrorFactory = (name: string) =>
  class BusinessError extends Error implements BusinessErrorShape {
    code: string
    httpCode?: number
    constructor(code: string, message?: string, httpCode?: number) {
      super(message ?? code)
      this.name = name
      this.code = code
      if (httpCode !== undefined) {
        this.httpCode = httpCode
      }
    }
  }

export interface BaseErrorInterface {
  name: string
  code: string
  message: string
  statusCode: HttpCodeType
  details?: Record<string, unknown>
  timestamp: Date
}

export interface ErrorDetail {
  code: string
  message: string
  field?: string
  details?: Record<string, unknown>
}

export class BaseError
  extends Error
  implements BaseErrorInterface, ErrorDetail
{
  name: string
  code: string
  statusCode: HttpCodeType
  details?: Record<string, unknown>
  timestamp: Date

  constructor(
    name: string,
    code: string,
    message: string,
    statusCode: HttpCodeType,
    details?: Record<string, unknown>,
  ) {
    super(message)
    this.name = name
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date()
  }
}

export const errorClassFactory = (name: string, statusCode: HttpCodeType) =>
  class BusinessError extends BaseError {
    constructor(
      code: string,
      message: string,
      details?: Record<string, unknown>,
    ) {
      super(name, code, message, statusCode, details)
    }
  }
