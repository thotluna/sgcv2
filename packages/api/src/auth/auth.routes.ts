import { Router } from 'express'
import { AuthController } from './auth.controller'
import { schemaValidation } from '../middleware/schema-validation'
import { validateCodeClient, validateSingUp } from './auth.schema'

const router: Router = Router()

router.post(
  '/code/validate',
  schemaValidation(validateCodeClient),
  AuthController.validationClientCode,
)

router.post('/singup', schemaValidation(validateSingUp), AuthController.singUp)

export default router
