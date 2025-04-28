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
