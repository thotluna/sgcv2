export type ServerEnvironment = 'development' | 'production' | 'test'
export interface ServerConfig {
  port: number
  environment: ServerEnvironment
  testMode: boolean
}
