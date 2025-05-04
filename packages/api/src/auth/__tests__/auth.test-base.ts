import { ServerApi } from '../../server'
import { AuthRespository } from '../auth.repository'
import { authRepositoryMock } from './auth.configtest'
import { AuthController, AuthRouter, AuthService } from '@auth'
import 'dotenv/config'
import { Application } from 'express'
import { Server } from 'http'
import i18next from 'i18next'

export let app: Application
let server!: Server
let repository: AuthRespository
export let i18n: typeof i18next
beforeAll(async () => {
  repository = authRepositoryMock
  const serverApp = ServerApi.getInstance()
  i18n = serverApp.getI18nextInstance()
  await i18n.changeLanguage('es')
  const service = new AuthService(repository)
  const authController = new AuthController(service)
  const authRouter = new AuthRouter(authController)
  authRouter.initializeRoutes(serverApp.getApp())

  server = serverApp.start()!
  app = serverApp.getApp()
})
afterAll(() => {
  server.close()
})
