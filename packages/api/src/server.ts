import { errorHandler } from './middleware/error-handler'
import { getI18n, setMiddleware } from './serve/middlewares'
import express, { Application, Router } from 'express'
import { Server } from 'http'
import i18next from 'i18next'

const { PORT } = process.env

export class ServerApi {
  private app: Application
  private router: Router
  private port: number = Number(PORT) || 3000
  private server?: Server
  public i18nextInstance: typeof i18next
  constructor() {
    this.i18nextInstance = getI18n()

    this.app = express()
    setMiddleware(this.app)
    this.router = Router()
  }
  public static getInstance(): ServerApi {
    const instance = new ServerApi()
    return instance
  }
  public getI18nextInstance(): typeof i18next {
    return this.i18nextInstance
  }
  public addRoute(path: string, router: Router) {
    this.router.use(path, router)
    this.app.use('/v1', this.router)
  }
  setPort(port: number) {
    this.port = port
  }
  public start(portForce?: number) {
    this.app.use(errorHandler)
    if (portForce) {
      this.server = this.app.listen(portForce, () => {
        // eslint-disable-next-line no-console
        console.log(`Server listening on port ${portForce}!`)
      })
      return this.server
    }
    while (this.port >= 3000 || this.port <= 4000) {
      try {
        this.port = Math.floor(Math.random() * (4000 - 3000 + 1)) + 3000
        this.server = this.app.listen(this.port, () => {
          // eslint-disable-next-line no-console
          console.log(`Server listening on port ${this.port}!`)
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
