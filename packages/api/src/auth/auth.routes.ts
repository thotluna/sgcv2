import { Router } from 'express'

import { schemaValidation } from '../middleware/schema-validation'
import { AuthController } from './auth.controller'
import {
  authorizeSchema,
  callbackSchema,
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

    this.router.get(
      '/callback',
      schemaValidation(callbackSchema),
      this.authController.callback,
    )
  }
}
