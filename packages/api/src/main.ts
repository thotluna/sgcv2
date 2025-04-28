import { ServerApi } from './server'
import {
  AuthRespository,
  SupabaseAuthRepository,
  AuthController,
  AuthRouter,
  AuthService,
} from '@auth'
import 'dotenv/config'

export const getAuthRouter = () => {
  const repository: AuthRespository = new SupabaseAuthRepository()
  const service = new AuthService(repository)
  const authController = new AuthController(service)
  const authRouter = new AuthRouter(authController)
  authRouter.initializeRoutes()
  return authRouter.getRouter()
}

const app = ServerApi.getInstance()
app.setPort(3001)
app.addRoute('/auth', getAuthRouter())

app.start(3001)
