import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { UsersController } from '@modules/users/infrastructure/http/users.controller';
import { authenticate } from '@auth/infrastructure/http/auth.middleware';
import { TYPES } from '@users/di/types';
import { validateSchema } from '@shared/middleware/validate-schema';
import { UpdateUserSchema } from './update-user.schema';
import { requireRoles } from '@modules/rbac/guards/roles.guard';
import { ROLES } from '@consts/roles';
import { UserFilterSchema } from './user-filter.schema';
import { CreateUserSchema } from './create-user.schema';



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
    this.router.patch('/me', authenticate, validateSchema(UpdateUserSchema), (req, res) =>
      this.usersController.updateMe(req, res)
    );
    this.router.get(
      '/',
      authenticate,
      requireRoles(ROLES.ADMIN),
      validateSchema(UserFilterSchema, 'query'),
      (req, res) => this.usersController.showAll(req, res)
    );
    this.router.post('/', authenticate, requireRoles(ROLES.ADMIN), validateSchema(CreateUserSchema), (req, res) => this.usersController.create(req, res));
  }

  getRouter() {
    return this.router;
  }
}
