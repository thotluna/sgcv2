import { TYPES } from '@auth/di/types';
import { AuthController } from '@auth/infrastructure/http/auth.controller';
import { validateSchema } from '@shared/middleware/validate-schema';
import { Router } from 'express';
import { inject, injectable } from 'inversify';

import { loginDtoSchema } from './login-dto-schema';

@injectable()
export class AuthRoutes {
  private router: Router;

  constructor(@inject(TYPES.AuthController) controller: AuthController) {
    this.router = Router();

    this.router.post('/login', validateSchema(loginDtoSchema), (req, res) => {
      return controller.login(req, res);
    });

    this.router.post('/logout', (req, res) => {
      return controller.logout(req, res);
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
