import { Router } from 'express';
import { CustomerController } from './customer.controller';
import { authenticate } from '../auth/middleware/auth.middleware';
import { Roles } from '../rbac/decorators/roles.decorator';
import { ROLES } from '../../consts/roles';
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
    this.router.post('/', authenticate, Roles(ROLES.ADMIN), (req, res) =>
      this.controller.create(req, res)
    );

    this.router.get('/', authenticate, Roles(ROLES.ADMIN), (req, res) =>
      this.controller.findAll(req, res)
    );

    this.router.get('/:id', authenticate, Roles(ROLES.ADMIN), (req, res) =>
      this.controller.findOne(req, res)
    );

    this.router.put('/:id', authenticate, Roles(ROLES.ADMIN), (req, res) =>
      this.controller.update(req, res)
    );

    this.router.delete('/:id', authenticate, Roles(ROLES.ADMIN), (req, res) =>
      this.controller.delete(req, res)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
