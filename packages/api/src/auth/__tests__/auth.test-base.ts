import { ServerApi } from '../../server'
import { AuthController } from '../auth.controller'
import { AuthRepository } from '../auth.repository'
import { AuthRouter } from '../auth.routes'
import { AuthService } from '../auth.service'
import { authRepository } from './auth.configtest'
import 'dotenv/config'
import { Application } from 'express'
import { Server } from 'http'
import i18next from 'i18next'

export let app: Application
let server!: Server
let repository: AuthRepository
export let i18n: typeof i18next

beforeAll(async () => {
  repository = authRepository

  const serverApp = ServerApi.getInstance()
  i18n = serverApp.getI18nextInstance()
  await i18n.changeLanguage('es')
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.spyOn(console, 'log').mockImplementation(() => {})
  serverApp.addRoute('/auth', getAuthRouter())
  server = serverApp.start()!
  app = serverApp.getApp()
})

afterAll(() => {
  server.close()
})

function getAuthRouter() {
  const service = new AuthService(repository)
  const authController = new AuthController(service)
  const authRouter = new AuthRouter(authController)
  authRouter.initializeRoutes()
  return authRouter.getRouter()
}
