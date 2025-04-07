export interface User {
  id: string
  name: string
}

export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}
