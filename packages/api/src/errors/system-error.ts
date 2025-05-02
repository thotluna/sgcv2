import { BaseError } from './errors'
import { HTTP_CODE, HttpCodeType } from '@sgcv2/shared'

// Interface para errores del sistema
export interface SystemErrorContract extends BaseError {
  severity: 'low' | 'medium' | 'high'
  stackTrace?: string
}

export class SystemErrorClass extends BaseError implements SystemErrorContract {
  severity: 'low' | 'medium' | 'high'
  stackTrace?: string

  constructor(
    name: string,
    httpCode: HttpCodeType,
    code: string,
    message?: string,
    severity: 'low' | 'medium' | 'high' = 'medium',
    stackTrace?: string,
    details?: Record<string, unknown>,
  ) {
    super(name, code, message ?? code, httpCode, details)
    this.severity = severity
    this.stackTrace = stackTrace ?? new Error().stack
  }

  // Método para mantener compatibilidad con código existente
  toJSON() {
    return {
      ...super.toJSON(),
      severity: this.severity,
      stackTrace: this.stackTrace,
    }
  }
}

interface SystemErrorOptions {
  code: string
  message?: string
  severity?: 'low' | 'medium' | 'high'
  httpCode?: HttpCodeType
  details?: Record<string, unknown>
  stackTrace?: string
}

export const createSystemErrorFactory = (
  name: string,
  httpCode: HttpCodeType,
) => {
  return class SystemErrorClass extends BaseError {
    severity: 'low' | 'medium' | 'high' = 'medium'
    stackTrace: string | undefined

    constructor({
      code,
      message,
      severity = 'medium',
      details,
      stackTrace,
    }: SystemErrorOptions) {
      super(name, code, message ?? code, httpCode, details)
      this.severity = severity
      this.stackTrace = stackTrace
    }

    toJSON() {
      return {
        ...super.toJSON(),
        severity: this.severity,
        stackTrace: this.stackTrace,
      }
    }
  }
}

export const SystemError = createSystemErrorFactory(
  'SystemError',
  HTTP_CODE.SERVER_ERROR,
) // Factory para errores del sistema
