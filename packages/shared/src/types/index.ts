export interface ApiResponse<T> {
  data?: T
  status: 'success' | 'error'
  httpCode?: number
  message?: string | null
  code: number | string | null
  metadata?: object | null
}

export * from './database.types'
export * from './clients.types'
