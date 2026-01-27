import { authenticate } from '@auth/infrastructure/http/auth.middleware';
import { PERMISSIONS } from '@consts/permissions';
import { TYPES } from '@customer/di/types';
import { CustomerController } from '@customer/infrastructure/http/customer.controller';
import { LocationRoutes } from '@customer/infrastructure/http/location.routes';
import { SubCustomerRoutes } from '@customer/infrastructure/http/subcustomer.routes';
import { Permission } from '@modules/rbac/decorators/permissions.decorator';
import { validateSchema } from '@shared/middleware/validate-schema';
import { Router } from 'express';
import { inject, injectable } from 'inversify';

import { CreateCustomerSchema, CustomerFilterSchema, UpdateCustomerSchema } from '@sgcv2/shared';

@injectable()
export class CustomerRoutes {
  private router: Router;

  constructor(
    @inject(TYPES.CustomerController) private customerController: CustomerController,
    @inject(TYPES.SubCustomerRoutes) private subCustomerRoutes: SubCustomerRoutes,
    @inject(TYPES.LocationRoutes) private locationRoutes: LocationRoutes
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Sub-customer routes
    this.router.use('/:customerId/sub-customers', this.subCustomerRoutes.getRouter());

    // Location routes
    this.router.use('/:customerId/locations', this.locationRoutes.getRouter());

    this.router.post(
      '/',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.CREATE.resource, PERMISSIONS.CUSTOMERS.CREATE.action),
      validateSchema(CreateCustomerSchema),
      (req, res) => this.customerController.create(req, res)
    );

    this.router.get(
      '/',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.READ.resource, PERMISSIONS.CUSTOMERS.READ.action),
      validateSchema(CustomerFilterSchema, 'query'),
      (req, res) => this.customerController.findAll(req, res)
    );

    this.router.get(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.READ.resource, PERMISSIONS.CUSTOMERS.READ.action),
      (req, res) => this.customerController.findOne(req, res)
    );

    this.router.put(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.UPDATE.resource, PERMISSIONS.CUSTOMERS.UPDATE.action),
      validateSchema(UpdateCustomerSchema),
      (req, res) => this.customerController.update(req, res)
    );

    this.router.delete(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.DELETE.resource, PERMISSIONS.CUSTOMERS.DELETE.action),
      (req, res) => this.customerController.delete(req, res)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
