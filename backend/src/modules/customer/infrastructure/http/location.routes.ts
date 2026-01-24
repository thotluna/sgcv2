import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@customer/di/types';
import { LocationController } from '@customer/infrastructure/http/location.controller';
import { authenticate } from '@auth/infrastructure/http/auth.middleware';
import { Permission } from '@modules/rbac/decorators/permissions.decorator';
import { PERMISSIONS } from '@consts/permissions';
import { validateSchema } from '@shared/middleware/validate-schema';
import {
  CreateCustomerLocationSchema,
  UpdateCustomerLocationSchema,
  CustomerLocationFilterSchema,
} from '@sgcv2/shared';

@injectable()
export class LocationRoutes {
  private router: Router;

  constructor(@inject(TYPES.LocationController) private locationController: LocationController) {
    this.router = Router({ mergeParams: true });
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Routes under /customers/:customerId/locations
    this.router.post(
      '/',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.CREATE.resource, PERMISSIONS.CUSTOMERS.CREATE.action),
      validateSchema(CreateCustomerLocationSchema),
      (req, res) => this.locationController.create(req, res)
    );

    this.router.get(
      '/',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.READ.resource, PERMISSIONS.CUSTOMERS.READ.action),
      validateSchema(CustomerLocationFilterSchema, 'query'),
      (req, res) => this.locationController.findAll(req, res)
    );

    // Individual location routes
    this.router.get(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.READ.resource, PERMISSIONS.CUSTOMERS.READ.action),
      (req, res) => this.locationController.findOne(req, res)
    );

    this.router.put(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.UPDATE.resource, PERMISSIONS.CUSTOMERS.UPDATE.action),
      validateSchema(UpdateCustomerLocationSchema),
      (req, res) => this.locationController.update(req, res)
    );

    this.router.delete(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.DELETE.resource, PERMISSIONS.CUSTOMERS.DELETE.action),
      (req, res) => this.locationController.delete(req, res)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
