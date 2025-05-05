import { HttpCodeType } from '@sgcv2/shared'

export interface CoreError {
  name: string
  code: string
  message: string
  timestamp: Date
}
export interface BusinessErrorInterface extends CoreError {
  httpCode?: HttpCodeType
  details?: Record<string, unknown>
}
export const createBusinessErrorFactory = (name: string) =>
  class BusinessError extends Error implements BusinessError {
    code: string
    httpCode?: HttpCodeType
    details?: Record<string, unknown>
    timestamp: Date
    constructor(
      code: string,
      message?: string,
      httpCode?: HttpCodeType,
      details?: Record<string, unknown>
    ) {
      super(message ?? code)
      this.name = name
      this.code = code
      this.httpCode = httpCode
      this.details = details
      this.timestamp = new Date()
    }
  }
export interface ErrorDetail {
  code: string
  message: string
  field?: string
  details?: Record<string, unknown>
}
export interface BaseErrorInterface {
  name: string
  code: string
  message: string
  statusCode: HttpCodeType
  details?: Record<string, unknown>
  timestamp: Date
}
export class BaseError extends Error implements BaseErrorInterface {
  code: string
  statusCode: HttpCodeType
  details?: Record<string, unknown>
  timestamp: Date
  constructor(
    name: string,
    code: string,
    message: string,
    statusCode: HttpCodeType,
    details?: Record<string, unknown>
  ) {
    super(message)
    this.name = name
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date()
  }
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp
    }
  }
}
export interface BusinessErrorOptions {
  code: string
  message: string
  details?: Record<string, unknown>
}
export const errorClassFactory = (name: string, statusCode: HttpCodeType) => {
  return class BusinessError extends BaseError {
    constructor({ code, message, details }: BusinessErrorOptions) {
      super(name, code, message, statusCode, details)
    }
  }
}
