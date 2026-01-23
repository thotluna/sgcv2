import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { HealthController } from '@modules/support/infrastructure/http/health.controller';
import { TYPES } from '@modules/support/di/types';

@injectable()
export class SupportRoutes {
  private readonly router: Router;

  constructor(
    @inject(TYPES.HealthController)
    private readonly controller: HealthController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/health', (req, res) => this.controller.getHealth(req, res));
  }

  getRouter(): Router {
    return this.router;
  }
}
