import { authenticate } from '@auth/infrastructure/http/auth.middleware';
import { PERMISSIONS } from '@consts/permissions';
import { Permission } from '@modules/rbac/decorators/permissions.decorator';
import { TYPES } from '@permissions/di/types';
import { PermissionsController } from '@permissions/infrastructure/http/permissions.controller';
import { Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class PermissionsRoutes {
  private router: Router;

  constructor(
    @inject(TYPES.PermissionsController)
    private readonly permissionsController: PermissionsController
  ) {
    this.router = Router();
    this.createRoutes();
  }

  createRoutes() {
    this.router.get(
      '/',
      authenticate,
      Permission(PERMISSIONS.PERMISSIONS.READ.resource, PERMISSIONS.PERMISSIONS.READ.action),
      (req, res) => this.permissionsController.getAll(req, res)
    );
  }

  getRouter() {
    return this.router;
  }
}
