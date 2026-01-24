import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@customer/di/types';
import { SubCustomerController } from '@customer/infrastructure/http/subcustomer.controller';
import { authenticate } from '@auth/infrastructure/http/auth.middleware';
import { Permission } from '@modules/rbac/decorators/permissions.decorator';
import { PERMISSIONS } from '@consts/permissions';
import { validateSchema } from '@shared/middleware/validate-schema';
import {
  CreateSubCustomerSchema,
  UpdateSubCustomerSchema,
  SubCustomerFilterSchema,
} from '@sgcv2/shared';

@injectable()
export class SubCustomerRoutes {
  private router: Router;

  constructor(
    @inject(TYPES.SubCustomerController) private subCustomerController: SubCustomerController
  ) {
    this.router = Router({ mergeParams: true });
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Routes under /customers/:customerId/sub-customers
    this.router.post(
      '/',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.CREATE.resource, PERMISSIONS.CUSTOMERS.CREATE.action),
      validateSchema(CreateSubCustomerSchema),
      (req, res) => this.subCustomerController.create(req, res)
    );

    this.router.get(
      '/',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.READ.resource, PERMISSIONS.CUSTOMERS.READ.action),
      validateSchema(SubCustomerFilterSchema, 'query'),
      (req, res) => this.subCustomerController.findAll(req, res)
    );

    // Individual sub-customer routes (can also be mounted elsewhere if preferred,
    // but typically they are accessed via ID)
    this.router.get(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.READ.resource, PERMISSIONS.CUSTOMERS.READ.action),
      (req, res) => this.subCustomerController.findOne(req, res)
    );

    this.router.put(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.UPDATE.resource, PERMISSIONS.CUSTOMERS.UPDATE.action),
      validateSchema(UpdateSubCustomerSchema),
      (req, res) => this.subCustomerController.update(req, res)
    );

    this.router.delete(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.DELETE.resource, PERMISSIONS.CUSTOMERS.DELETE.action),
      (req, res) => this.subCustomerController.delete(req, res)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
