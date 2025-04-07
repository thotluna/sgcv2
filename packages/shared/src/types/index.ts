export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

export * from './database.types'
export * from './clients.types'
