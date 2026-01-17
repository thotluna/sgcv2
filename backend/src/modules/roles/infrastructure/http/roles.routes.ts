import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { RolesController } from '@roles/infrastructure/http/roles.controller';
import { authenticate } from '@auth/infrastructure/http/auth.middleware';
import { TYPES } from '@roles/di/types';
import { validateSchema } from '@shared/middleware/validate-schema';
import { createRoleSchema } from '@sgcv2/shared';
import { Permission } from '@modules/rbac/decorators/permissions.decorator';
import { PERMISSIONS } from '@consts/permissions';

@injectable()
export class RolesRoutes {
  private router: Router;

  constructor(@inject(TYPES.RolesController) private readonly rolesController: RolesController) {
    this.router = Router();
    this.createRoutes();
  }

  createRoutes() {
    this.router.post(
      '/',
      authenticate,
      Permission(PERMISSIONS.ROLES.CREATE.resource, PERMISSIONS.ROLES.CREATE.action),
      validateSchema(createRoleSchema),
      (req, res) => this.rolesController.create(req, res)
    );
  }

  getRouter() {
    return this.router;
  }
}
