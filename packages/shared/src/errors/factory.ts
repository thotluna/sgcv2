export const createErrorFactory = (name: string) =>
  class BusinessError extends Error {
    constructor(message: string) {
      super(message)
      this.name = name
    }
  }
