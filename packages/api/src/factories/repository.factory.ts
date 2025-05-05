import { ServerEnvironment } from '../types/server.config'
import {
  AuthRespository,
  AuthMockRepository,
  SupabaseAuthRepository
} from '@auth'

export function createRepository(env: ServerEnvironment): AuthRespository {
  switch (env) {
    case 'test':
      return new AuthMockRepository()
    case 'production':
      return new SupabaseAuthRepository()
    default:
      return new AuthMockRepository()
  }
}
