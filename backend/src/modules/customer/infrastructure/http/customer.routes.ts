import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { CustomerController } from './customer.controller';
import { authenticate } from '@auth/infrastructure/http/auth.middleware';
import { Permission } from '@modules/rbac/decorators/permissions.decorator';
import { PERMISSIONS } from '@consts/permissions';
import { validateSchema } from '@shared/middleware/validate-schema';
import { CreateCustomerSchema } from './create-customer.schema';
import { UpdateCustomerSchema } from './update-customer.schema';
import { CustomerFilterSchema } from './customer-filter.schema';

@injectable()
export class CustomerRoutes {
  private router: Router;

  constructor(@inject(TYPES.CustomerController) private customerController: CustomerController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
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
