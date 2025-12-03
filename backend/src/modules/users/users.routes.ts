import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../auth/middleware/auth.middleware';
import { requireRoles } from '../rbac/guards/roles.guard';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';

// const router = Router();
// const usersController = new UsersController();

// /**
//  * @route   GET /api/users/me
//  * @desc    Get current user profile
//  * @access  Private
//  */
// router.get('/me', authenticate, (req, res) => usersController.me(req, res));

// /**
//  * @route   GET /api/users
//  * @desc    Get all users (with pagination)
//  * @access  Private (Admin only)
//  */
// router.get('/', authenticate, requireRoles('Administrador'), (req, res) =>
//   usersController.getAll(req, res)
// );

// /**
//  * @route   GET /api/users/:id
//  * @desc    Get user by ID
//  * @access  Private (Admin only)
//  */
// router.get('/:id', authenticate, requireRoles('Administrador'), (req, res) =>
//   usersController.getById(req, res)
// );

// /**
//  * @route   POST /api/users
//  * @desc    Create new user
//  * @access  Private (Admin only)
//  */
// router.post('/', authenticate, requireRoles('Administrador'), (req, res) =>
//   usersController.create(req, res)
// );

// /**
//  * @route   PUT /api/users/:id
//  * @desc    Update user
//  * @access  Private (Own profile or Admin)
//  */
// router.put('/:id', authenticate, (req, res) => usersController.update(req, res));

// /**
//  * @route   DELETE /api/users/:id
//  * @desc    Delete user (soft delete)
//  * @access  Private (Admin only)
//  */
// router.delete('/:id', authenticate, requireRoles('Administrador'), (req, res) =>
//   usersController.delete(req, res)
// );

// export default router;

@injectable()
export class UsersRoutes {
  private usersController: UsersController;
  private router: Router;

  constructor(@inject(TYPES.UsersController) usersController: UsersController) {
    this.usersController = usersController;
    this.router = Router();

    this.createRoutes();
  }

  createRoutes() {
    this.router.get('/me', authenticate, (req, res) => this.usersController.me(req, res));
    this.router.get('/', authenticate, requireRoles('Administrador'), (req, res) =>
      this.usersController.getAll(req, res)
    );
    this.router.get('/:id', authenticate, requireRoles('Administrador'), (req, res) =>
      this.usersController.getById(req, res)
    );
    this.router.post('/', authenticate, requireRoles('Administrador'), (req, res) =>
      this.usersController.create(req, res)
    );
    this.router.put('/:id', authenticate, (req, res) => this.usersController.update(req, res));
    this.router.delete('/:id', authenticate, requireRoles('Administrador'), (req, res) =>
      this.usersController.delete(req, res)
    );
  }

  getRouter() {
    return this.router;
  }
}
