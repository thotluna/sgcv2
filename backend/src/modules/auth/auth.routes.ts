import { Router } from 'express';
import passport from 'passport';
import { AuthController } from './auth.controller';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';

@injectable()
export class AuthRoutes {
  private controller: AuthController;
  private router: Router;
  constructor(@inject(TYPES.AuthController) controller: AuthController) {
    this.controller = controller;
    this.router = Router();
    this.createRoutes();
  }

  createRoutes(): void {
    this.router.post('/login', (req, res) => {
      return this.controller.login(req, res);
    });

    this.router.post('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
      return this.controller.logout(req, res);
    });

    this.router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
      return this.controller.me(req, res);
    });
  }

  getRouter() {
    return this.router;
  }
}
