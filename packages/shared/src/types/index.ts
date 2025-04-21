export interface ApiResponse<T> {
  data?: T
  status: 'success' | 'error'
  message?: string | null
  code: number | null
  metadata?: object | null
}

export * from './database.types'
export * from './clients.types'
