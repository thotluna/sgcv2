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

    this.router.get(
      '/',
      authenticate,
      Permission(PERMISSIONS.ROLES.READ.resource, PERMISSIONS.ROLES.READ.action),
      (req, res) => this.rolesController.getAll(req, res)
    );

    this.router.get(
      '/permissions',
      authenticate,
      Permission(PERMISSIONS.PERMISSIONS.READ.resource, PERMISSIONS.PERMISSIONS.READ.action),
      (req, res) => this.rolesController.getAllPermissions(req, res)
    );

    this.router.get(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.ROLES.READ.resource, PERMISSIONS.ROLES.READ.action),
      (req, res) => this.rolesController.getById(req, res)
    );

    this.router.patch(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.ROLES.UPDATE.resource, PERMISSIONS.ROLES.UPDATE.action),
      (req, res) => this.rolesController.update(req, res)
    );

    this.router.delete(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.ROLES.DELETE.resource, PERMISSIONS.ROLES.DELETE.action),
      (req, res) => this.rolesController.delete(req, res)
    );
  }

  getRouter() {
    return this.router;
  }
}
