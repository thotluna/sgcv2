import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../auth/middleware/auth.middleware';
import { requireRoles } from '../auth/guards/rbac.guard';

const router = Router();
const usersController = new UsersController();

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, (req, res) => usersController.me(req, res));

/**
 * @route   GET /api/users
 * @desc    Get all users (with pagination)
 * @access  Private (Admin only)
 */
router.get('/', authenticate, requireRoles('Administrador'), (req, res) =>
  usersController.getAll(req, res)
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin only)
 */
router.get('/:id', authenticate, requireRoles('Administrador'), (req, res) =>
  usersController.getById(req, res)
);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private (Admin only)
 */
router.post('/', authenticate, requireRoles('Administrador'), (req, res) =>
  usersController.create(req, res)
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Own profile or Admin)
 */
router.put('/:id', authenticate, (req, res) => usersController.update(req, res));

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (soft delete)
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, requireRoles('Administrador'), (req, res) =>
  usersController.delete(req, res)
);

export default router;
