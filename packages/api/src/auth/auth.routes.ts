import {
  AuthController,
  authorizeSchema,
  httpCustomerCodeSchema,
  httpEmailCodeSchema,
  httpSignUpSchema,
  httpSingInSchema,
} from '@auth'
import { schemaValidation, verificarToken } from '@middleware'
import { type Application, Router } from 'express'

export class AuthRouter {
  private static readonly routes = {
    customerCode: '/customer-code',
    validateCode: '/code/validate',
    signUp: '/signup',
    signIn: '/signin',
    authorize: '/authorize',
    callback: '/callback',
    user: '/user',
  } as const
  static apiPrefix = '/v1/auth'
  static getAbsoluteRoutes() {
    const prefix = AuthRouter.apiPrefix
    return Object.fromEntries(
      Object.entries(AuthRouter.routes).map(([k, v]) => [k, `${prefix}${v}`]),
    ) as typeof AuthRouter.routes
  }
  getRelativeRoutes() {
    return AuthRouter.routes
  }
  private router: Router
  private authController: AuthController
  constructor(authController: AuthController) {
    this.router = Router()
    this.authController = authController
  }
  getRouter() {
    return this.router
  }
  initializeRoutes(app: Application) {
    const routes = this.getRelativeRoutes()
    this.router.post(
      routes.customerCode,
      schemaValidation(httpEmailCodeSchema),
      this.authController.customerCode,
    )
    this.router.post(
      routes.validateCode,
      schemaValidation(httpCustomerCodeSchema),
      this.authController.validationCustomerCode,
    )
    this.router.post(
      routes.signUp,
      schemaValidation(httpSignUpSchema),
      this.authController.signUp,
    )
    this.router.post(
      routes.signIn,
      schemaValidation(httpSingInSchema),
      this.authController.signIn,
    )
    this.router.get(
      routes.authorize,
      schemaValidation(authorizeSchema),
      this.authController.authorize,
    )
    this.router.get(routes.callback, this.authController.callback)
    this.router.get(routes.user, verificarToken, this.authController.getUser)
    app.use('/v1/auth', this.router)
  }
}
