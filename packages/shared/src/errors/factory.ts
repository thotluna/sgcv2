export interface BusinessErrorShape {
  code: string
  message: string
}

export const createErrorFactory = (name: string) =>
  class BusinessError extends Error implements BusinessErrorShape {
    code: string
    constructor(code: string, message?: string) {
      super(message ?? code)
      this.name = name
      this.code = code
    }
  }
