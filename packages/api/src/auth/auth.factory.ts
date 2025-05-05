import { AuthController } from '@auth/auth.controller'
import { AuthMockRepository } from '@auth/auth.mock.repository'
import { AuthRespository } from '@auth/auth.repository'
import { AuthRouter } from '@auth/auth.routes'
import { AuthService } from '@auth/auth.service'
import { SupabaseAuthRepository } from '@auth/auth.supabase.repository'

interface Props {
  controller?: AuthController
  service?: AuthService
  repository?: AuthRespository
}

export function authFactory({
  controller,
  service,
  repository
}: Props): AuthRouter {
  let _repository: AuthRespository

  if (repository) {
    _repository = repository
  } else if (process.env.NODE_ENV === 'test') {
    _repository = new AuthMockRepository()
  } else {
    _repository = new SupabaseAuthRepository()
  }

  const _service = service ?? new AuthService(_repository)
  const _controller = controller ?? new AuthController(_service)
  return new AuthRouter(_controller)
}
