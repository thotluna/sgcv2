import { ApiResponse } from '@sgcv2/shared'

export class AuthResponseBuilder<T> {
  private response: ApiResponse<T> = {
    status: 'success',
    code: 200,
    // httpCode es opcional y solo se agrega si se setea
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
  code(code: number | string) {
    this.response.code = code
    return this
  }
  httpCode(httpCode: number) {
    // Solo agrega el campo si se setea
    this.response.httpCode = httpCode
    return this
  }
  metadata(metadata: object) {
    this.response.metadata = metadata
    return this
  }
  build(): ApiResponse<T> {
    return this.response
  }
}
