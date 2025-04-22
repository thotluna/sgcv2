import express, { Application, Router } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import { errorHandler } from './middleware/error-handler'
import { Server } from 'http'

const { ALLOWED_HOSTS, PORT } = process.env

export class ServerApi {
  private static instance: ServerApi
  private app: Application
  private router: Router
  private port: number = Number(PORT) || 3000
  private server?: Server

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

  setPort(port: number) {
    this.port = port
  }

  public start() {
    this.app.use(errorHandler)

    while (this.port >= 3000 || this.port <= 4000) {
      try {
        this.port = Math.floor(Math.random() * (4000 - 3000 + 1)) + 3000
        this.server = this.app.listen(this.port, () => {
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
