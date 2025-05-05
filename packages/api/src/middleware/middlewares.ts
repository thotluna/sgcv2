import swagerSetup from '../docs/swagger'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { type Application, json, RequestHandler } from 'express'
import i18next from 'i18next'
import i18nextFsBackend from 'i18next-fs-backend'
import middleware from 'i18next-http-middleware'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'

const { ALLOWED_HOSTS } = process.env

export function setMiddleware(app: Application) {
  app.use(json())
  app.use(cookieParser())
  app.use(morgan('dev'))
  app.use(
    cors({
      origin: ALLOWED_HOSTS!,
      credentials: true
    })
  )
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagerSetup))
  app.use(i18nMiddleware())
}

export function getI18n() {
  const i18n = i18next
  i18n
    .use(i18nextFsBackend)
    .use(middleware.LanguageDetector)
    .init({
      debug: false,
      backend: {
        loadPath: __dirname + '../../locales/{{lng}}/{{ns}}.json',
        addPath: __dirname + '../../locales/{{lng}}/{{ns}}.missing.json',
        reloadInterval: 0,
        saveMissing: false
      },
      fallbackLng: 'es',
      preload: ['en', 'es'],
      detection: {
        order: ['querystring', 'cookie', 'header'],
        caches: ['cookie']
      },
      load: 'languageOnly',
      saveMissing: true
    })
  return i18n
}

function i18nMiddleware(): RequestHandler {
  const i18n = getI18n()
  return middleware.handle(i18n, {
    ignoreRoutes: ['/foo'],
    removeLngFromUrl: false
  })
}
