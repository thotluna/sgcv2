export interface BusinessErrorShape {
  code: string
  message: string
  httpCode?: number // Opcional, para transición suave
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
  statusCode: number
  details?: Record<string, unknown>
  timestamp: Date
}

export class BaseError extends Error implements BaseErrorInterface {
  name: string
  code: string
  statusCode: number
  details?: Record<string, unknown>
  timestamp: Date

  constructor(
    name: string,
    code: string,
    message: string,
    statusCode = 500,
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

export const errorClassFactory = (name: string, statusCode: number) =>
  class BusinessError extends BaseError {
    constructor(
      code: string,
      message: string,
      details?: Record<string, unknown>,
    ) {
      super(name, code, message, statusCode, details)
    }
  }
