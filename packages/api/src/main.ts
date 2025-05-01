// Habilita los alias de módulos en producción
import { ServerApi } from './server'
import {
  AuthRespository,
  SupabaseAuthRepository,
  AuthController,
  AuthRouter,
  AuthService,
} from '@auth'
import { SupabaseAuthRepositoryMock } from '@auth/auth.supabase.repository.mock'
import logger from '@utils/logger'
import 'dotenv/config'
import 'module-alias/register'

export const getAuthRouter = () => {
  const args = process.argv.slice(2)
  const testFlag = args.find(arg => arg === '-t' || arg === '--test')

  let repository: AuthRespository

  if (testFlag) {
    loggerInMain('Modo de pruebas activado')
    repository = new SupabaseAuthRepositoryMock()
  } else {
    repository = new SupabaseAuthRepository()
  }
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

function loggerInMain(message: string) {
  logger.warn(message)
}
