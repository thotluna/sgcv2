import express, { Application, Router } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import { errorHandler } from './middleware/error-handler'

const { ALLOWED_HOSTS, PORT } = process.env

export class ServerApi {
  private static instance: ServerApi
  private app: Application
  private router: Router

  private constructor() {
    this.app = express()
    this.app.use(morgan('dev'))
    this.app.use(cookieParser())
    this.app.use(
      cors({
        origin: ALLOWED_HOSTS!,
        credentials: true,
      }),
    )
    this.app.use(express.json())

    this.router = Router()
    this.app.use('/v1', this.router)
  }

  public static getInstance(): ServerApi {
    if (!ServerApi.instance) {
      ServerApi.instance = new ServerApi()
    }
    return ServerApi.instance
  }

  public addRoute(path: string, router: Router) {
    this.router.use(path, router)
    this.app.use('/v1', this.router)
  }

  public start() {
    this.app.use(errorHandler)
    const server = this.app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}!`)
    })

    return server
  }

  public getApp() {
    return this.app
  }
}
