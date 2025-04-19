import { Router } from 'express'
import { AuthController } from './auth.controller'
import { schemaValidation } from '../middleware/schema-validation'
import {
  httpClientCodeSchema,
  httpSingInSchema,
  httpSingUpSchema,
} from './auth.schema'

const router: Router = Router()

router.post(
  '/code/validate',
  schemaValidation(httpClientCodeSchema),
  AuthController.validationClientCode,
)
router.post(
  '/singup',
  schemaValidation(httpSingUpSchema),
  AuthController.singUp,
)
// router.get('/check-session', AuthController.checkSession)
router.post(
  '/signin',
  schemaValidation(httpSingInSchema),
  AuthController.singIn,
)

router.get('/authorize', AuthController.authorize)
router.get('/callback', AuthController.callback)

export default router
