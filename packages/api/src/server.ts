import { errorHandler } from './middleware/error-handler.middleware'
import { setMiddleware } from './middleware/middlewares'
import logger from '@utils/logger'
import express, { type Application } from 'express'
import { Server } from 'http'

const { PORT } = process.env

export class ServerApi {
  private app: Application
  private port: number = Number(PORT) || 3000
  private server?: Server

  constructor() {
    this.app = express()
    setMiddleware(this.app)
  }
  public static getInstance(): ServerApi {
    const instance = new ServerApi()
    return instance
  }

  public start(portForce?: number) {
    this.app.use(errorHandler)
    if (portForce) {
      this.server = this.app.listen(portForce, () => {
        logger.info(`Server listening on port ${portForce}!`)
      })
      return this.server
    }
    while (this.port >= 3000 || this.port <= 4000) {
      try {
        this.port = Math.floor(Math.random() * (4000 - 3000 + 1)) + 3000
        this.server = this.app.listen(this.port, () => {
          logger.info(`Server listening on port ${portForce}!`)
        })
        return this.server
      } catch {
        continue
      }
    }
    return null
  }
  public getApp() {
    return this.app
  }
}
