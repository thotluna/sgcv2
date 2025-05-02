import { createRepository } from './factories/repository.factory'
import { ServerApi } from './server'
import { ServerConfig, ServerEnvironment } from './types/server.config'
import { AuthRespository, AuthService, AuthController, AuthRouter } from '@auth'
import { AuthMockRepository } from '@auth/auth.mock.repository'
import logger from '@utils/logger'
import { config } from 'dotenv'
import { Request, Response } from 'express'
import 'module-alias/register'

class ApplicationBootstrapper {
  private logger = logger
  private config: ServerConfig

  constructor() {
    config()
    this.config = this.loadConfiguration()
  }

  private loadConfiguration(): ServerConfig {
    const port = Number(process.env.PORT) || 3001

    return {
      port,
      environment: (process.env.NODE_ENV || 'development') as ServerEnvironment,
      testMode: process.argv.includes('--test'),
    }
  }

  private createDependencies() {
    const repository = createRepository(this.config.environment)
    const service = new AuthService(repository)
    const authController = new AuthController(service)

    return { repository, authController }
  }

  public async start() {
    try {
      const { repository, authController } = this.createDependencies()

      const app = ServerApi.getInstance()

      const authRouter = new AuthRouter(authController)
      authRouter.initializeRoutes()

      app.addRoute('/auth', authRouter.getRouter())

      // Endpoint de reset solo en modo test
      if (this.config.testMode) {
        app.getApp().get('/reset-mock', this.createResetEndpoint(repository))
        logger.warn('Run on test mode')
      }

      await app.start(this.config.port)

      this.logger.info(`Server started on port ${this.config.port}`)
    } catch (error) {
      this.logger.error('Failed to start application', error)
      process.exit(1)
    }
  }

  private createResetEndpoint(repository: AuthRespository) {
    return (_req: Request, res: Response) => {
      if (repository instanceof AuthMockRepository) {
        repository.resetMockData()
        res.sendStatus(200)
      } else {
        res.sendStatus(403)
      }
    }
  }
}

// Punto de entrada
new ApplicationBootstrapper().start()
