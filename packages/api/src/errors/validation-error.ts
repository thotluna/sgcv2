import { BaseError } from './errors'
import { HTTP_CODE, HttpCodeType } from '@sgcv2/shared'

interface ValidationErrorContract extends BaseError {
  field?: string
  validationRules?: Record<string, unknown>
}
interface ValidationErrorOptions {
  code: string
  message?: string
  field?: string
  details?: Record<string, unknown>
  httpCode?: HttpCodeType
  validationRules?: Record<string, unknown>
}

const createValidationErrorFactory = (name: string) => {
  return class ValidationErrorClass
    extends BaseError
    implements ValidationErrorContract
  {
    field?: string
    validationRules?: Record<string, unknown>

    constructor({
      code,
      message,
      field,
      details,
      httpCode = HTTP_CODE.BAD_REQUEST,
      validationRules,
    }: ValidationErrorOptions) {
      super(name, code, message ?? code, httpCode, details)
      this.field = field
      this.validationRules = validationRules
    }

    toJSON() {
      return {
        ...super.toJSON(),
        field: this.field,
        validationRules: this.validationRules,
      }
    }
  }
}

export const ValidationError = createValidationErrorFactory('ValidationError')
