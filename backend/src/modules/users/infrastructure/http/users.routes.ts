import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { UsersController } from '@modules/users/infrastructure/http/users.controller';
import { authenticate } from '@auth/infrastructure/http/auth.middleware';
import { TYPES } from '@users/di/types';

@injectable()
export class UsersRoutes {
  private usersController: UsersController;
  private router: Router;

  constructor(@inject(TYPES.UsersController) usersController: UsersController) {
    this.usersController = usersController;
    this.router = Router();

    this.createRoutes();
  }

  createRoutes() {
    this.router.get('/me', authenticate, (req, res) => this.usersController.me(req, res));
    this.router.patch('/me', authenticate, (req, res) => this.usersController.updateMe(req, res));
  }

  getRouter() {
    return this.router;
  }
}
