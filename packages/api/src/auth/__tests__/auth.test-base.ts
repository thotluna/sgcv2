import 'dotenv/config'
import { AuthService } from '../auth.service'
import { AuthController } from '../auth.controller'
import { AuthRouter } from '../auth.routes'
import { ServerApi } from '../../server'
import { Server } from 'http'
import { Application } from 'express'
import { AuthsRepository } from '../types'
import { authRepository } from './auth.configtest'

export let app: Application
let server: Server | null
let repository: AuthsRepository

beforeAll(() => {
  repository = authRepository

  const serverApp = ServerApi.getInstance()
  serverApp.addRoute('/auth', getAuthRouter())
  server = serverApp.start()
  app = serverApp.getApp()
})

afterAll(() => {
  server?.close()
})

function getAuthRouter() {
  const service = new AuthService(repository)
  const authController = new AuthController(service)
  const authRouter = new AuthRouter(authController)
  authRouter.initializeRoutes()
  return authRouter.getRouter()
}
