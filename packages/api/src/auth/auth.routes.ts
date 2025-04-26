import { schemaValidation } from '../middleware/schema-validation'
import { AuthController } from './auth.controller'
import {
  authorizeSchema,
  httpCustomerCodeSchema,
  httpEmailCodeSchema,
  httpSignUpSchema,
  httpSingInSchema,
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
      '/customer-code',
      schemaValidation(httpEmailCodeSchema),
      this.authController.customerCode,
    )
    this.router.post(
      '/code/validate',
      schemaValidation(httpCustomerCodeSchema),
      this.authController.validationCustomerCode,
    )
    this.router.post(
      '/signup',
      schemaValidation(httpSignUpSchema),
      this.authController.signUp,
    )
    this.router.post(
      '/signin',
      schemaValidation(httpSingInSchema),
      this.authController.signIn,
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
