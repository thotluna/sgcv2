import { Router } from 'express';
import { CustomerController } from './customer.controller';
import { authenticate } from '../auth/infrastructure/http/auth.middleware';
import { Permission } from '../rbac/decorators/permissions.decorator';
import { PERMISSIONS } from '../../consts/permissions';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';

@injectable()
export class CustomerRoutes {
  private controller: CustomerController;
  private router: Router;

  constructor(@inject(TYPES.CustomerController) controller: CustomerController) {
    this.controller = controller;
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post(
      '/',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.CREATE.resource, PERMISSIONS.CUSTOMERS.CREATE.action),
      (req, res) => this.controller.create(req, res)
    );

    this.router.get(
      '/',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.READ.resource, PERMISSIONS.CUSTOMERS.READ.action),
      (req, res) => this.controller.findAll(req, res)
    );

    this.router.get(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.READ.resource, PERMISSIONS.CUSTOMERS.READ.action),
      (req, res) => this.controller.findOne(req, res)
    );

    this.router.put(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.UPDATE.resource, PERMISSIONS.CUSTOMERS.UPDATE.action),
      (req, res) => this.controller.update(req, res)
    );

    this.router.delete(
      '/:id',
      authenticate,
      Permission(PERMISSIONS.CUSTOMERS.DELETE.resource, PERMISSIONS.CUSTOMERS.DELETE.action),
      (req, res) => this.controller.delete(req, res)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
