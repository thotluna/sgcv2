import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { UsersController } from '@modules/users/infrastructure/http/users.controller';
import { authenticate } from '@auth/infrastructure/http/auth.middleware';
import { TYPES } from '@users/di/types';
import { validateSchema } from '@shared/middleware/validate-schema';
import { UpdateMeSchema, AdminUpdateUserSchema } from './update-user.schema';
import { Permission } from '@modules/rbac/decorators/permissions.decorator';
import { PERMISSIONS } from '@consts/permissions';
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
    this.router.patch('/me', authenticate, validateSchema(UpdateMeSchema), (req, res) =>
      this.usersController.updateMe(req, res)
    );
    this.router.get(
      '/',
      authenticate,
      Permission(PERMISSIONS.USERS.READ.resource, PERMISSIONS.USERS.READ.action),
      validateSchema(UserFilterSchema, 'query'),
      (req, res) => this.usersController.showAll(req, res)
    );
    this.router.get(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.USERS.READ.resource, PERMISSIONS.USERS.READ.action),
      (req, res) => this.usersController.show(req, res)
    );
    this.router.post(
      '/',
      authenticate,
      Permission(PERMISSIONS.USERS.CREATE.resource, PERMISSIONS.USERS.CREATE.action),
      validateSchema(CreateUserSchema),
      (req, res) => this.usersController.create(req, res)
    );
    this.router.patch(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.USERS.UPDATE.resource, PERMISSIONS.USERS.UPDATE.action),
      validateSchema(AdminUpdateUserSchema),
      (req, res) => this.usersController.update(req, res)
    );
  }

  getRouter() {
    return this.router;
  }
}
