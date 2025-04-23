import { schemaValidation } from '../middleware/schema-validation'
import { AuthController } from './auth.controller'
import {
  authorizeSchema,
  httpClientCodeSchema,
  httpSingInSchema,
  httpSingUpSchema,
} from './auth.schema'
import { Router } from 'express'

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

      this.authController.callback,
    )

    this.router.get('/user', this.authController.getUser)
    // this.router.get('/session', this.authController.session)
  }
}
