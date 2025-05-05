import { ServerApi } from '../../server'
import { RouteManaget } from '@api/routes.manager'
import { getI18n } from '@middleware'
import 'dotenv/config'
import { Application } from 'express'
import { Server } from 'http'
import i18next from 'i18next'

export let app: Application
let server!: Server
export let i18n: typeof i18next

beforeAll(async () => {
  const serverApp = ServerApi.getInstance()
  i18n = getI18n()
  await i18n.changeLanguage('es')
  RouteManaget.getInstance(serverApp.getApp())

  server = serverApp.start()!
  app = serverApp.getApp()
})

afterAll(async () => {
  await i18n.off('languageChanged')
  server.close()
})
