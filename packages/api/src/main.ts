import { AuthController } from './auth/auth.controller'
import { SupabaseAuthRepository } from './auth/auth.repository'
import { AuthRouter } from './auth/auth.routes'
import { AuthService } from './auth/auth.service'
import { AuthsRepository } from './auth/types'
import { ServerApi } from './server'

export const getAuthRouter = () => {
  const repository: AuthsRepository = new SupabaseAuthRepository()
  const service = new AuthService(repository)
  const authController = new AuthController(service)
  const authRouter = new AuthRouter(authController)
  authRouter.initializeRoutes()
  return authRouter.getRouter()
}

const app = ServerApi.getInstance()
app.setPort(3001)
app.addRoute('/auth', getAuthRouter())

app.start()
