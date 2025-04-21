import { Router } from 'express'
import { AuthController } from './auth.controller'
import { schemaValidation } from '../middleware/schema-validation'
import {
  authorizeSchema,
  httpClientCodeSchema,
  httpSingInSchema,
  httpSingUpSchema,
} from './auth.schema'

export class AuthRouter {
  private router: Router
  private authController: AuthController

  constructor(authController: AuthController) {
    this.router = Router()
    this.authController = authController
  }

  getRouter() {
    return this.router
  }

  initializeRoutes() {
    this.router.post(
      '/code/validate',
      schemaValidation(httpClientCodeSchema),
      this.authController.validationClientCode,
    )
    this.router.post(
      '/singup',
      schemaValidation(httpSingUpSchema),
      this.authController.singUp,
    )
    this.router.post(
      '/signin',
      schemaValidation(httpSingInSchema),
      this.authController.singIn,
    )
    this.router.get(
      '/authorize',
      schemaValidation(authorizeSchema),
      this.authController.authorize,
    )

    this.router.get('/callback', this.authController.callback)
  }
}
