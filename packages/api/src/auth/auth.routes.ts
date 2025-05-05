import {
  AuthController,
  authorizeSchema,
  httpCustomerCodeSchema,
  httpEmailCodeSchema,
  httpSignUpSchema,
  httpSingInSchema
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
    user: '/user'
  } as const

  static apiPrefix = '/v1/auth'

  static getAbsoluteRoutes() {
    const prefix = AuthRouter.apiPrefix
    return Object.fromEntries(
      Object.entries(AuthRouter.routes).map(([k, v]) => [k, `${prefix}${v}`])
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
      this.authController.customerCode
    )
    this.router.post(
      routes.validateCode,
      schemaValidation(httpCustomerCodeSchema),
      this.authController.validationCustomerCode
    )
    this.router.post(
      routes.signUp,
      schemaValidation(httpSignUpSchema),
      this.authController.signUp
    )
    /**
     * @openapi
     * /auth/login:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Iniciar sesión de usuario
     *     description: Autentica a un usuario y devuelve tokens de acceso y refresco.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Correo electrónico del usuario.
     *                 example: usuario@ejemplo.com
     *               password:
     *                 type: string
     *                 format: password
     *                 description: Contraseña del usuario.
     *                 example: password123
     *     responses:
     *       '200':
     *         description: Autenticación exitosa. Devuelve tokens.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 accessToken:
     *                   type: string
     *                   description: Token de acceso JWT.
     *                 refreshToken:
     *                    type: string
     *                    description: Token de refresco JWT.
     *       '400':
     *         description: Datos de entrada inválidos (e.g., falta email o contraseña).
     *       '401':
     *         description: Credenciales inválidas.
     *       '500':
     *         description: Error interno del servidor.
     */
    this.router.post(
      routes.signIn,
      schemaValidation(httpSingInSchema),
      this.authController.signIn
    )
    this.router.get(
      routes.authorize,
      schemaValidation(authorizeSchema),
      this.authController.authorize
    )
    this.router.get(routes.callback, this.authController.callback)
    this.router.get(routes.user, verificarToken, this.authController.getUser)
    this.router.get('/reset-mock', this.authController.resetMock)
    app.use(AuthRouter.apiPrefix, this.router)
  }
}
