import { RouteManaget } from './routes.manager'
import { ServerApi } from './server'
import { ServerConfig, ServerEnvironment } from './types/server.config'
import logger from '@utils/logger'
import { config } from 'dotenv'
import 'module-alias/register'

class ApplicationBootstrapper {
  private logger = logger
  private config: ServerConfig
  constructor() {
    config()
    this.config = this.loadConfiguration()
  }
  private loadConfiguration(): ServerConfig {
    process.env.NODE_ENV = process.argv.includes('--test')
      ? 'test'
      : process.env.NODE_ENV
    const port = Number(process.env.PORT) || 3001
    return {
      port,
      environment: (process.env.NODE_ENV || 'development') as ServerEnvironment,
      testMode: process.argv.includes('--test')
    }
  }

  public async start() {
    try {
      const app = ServerApi.getInstance()
      RouteManaget.getInstance(app.getApp())
      if (this.config.testMode) {
        logger.warn('Run on test mode')
      }
      await app.start(this.config.port)
      this.logger.info(`Server started on port ${this.config.port}`)
    } catch (error) {
      this.logger.error('Failed to start application', error)
      process.exit(1)
    }
  }
}
new ApplicationBootstrapper().start()
