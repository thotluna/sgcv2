import { Router } from 'express';
import { CustomerController } from './customer.controller';
import { authenticate } from '../auth/middleware/auth.middleware';
import { Roles } from '../rbac/decorators/roles.decorator';
import { ROLES } from '../../consts/roles';

const router = Router();
const customerController = new CustomerController();

/**
 * @route   POST /api/customers
 * @desc    Create new customer
 * @access  Private (Admin only)
 */
router.post('/', authenticate, Roles(ROLES.ADMIN), (req, res) =>
  customerController.create(req, res)
);

/**
 * @route   GET /api/customers
 * @desc    Get all customers (with pagination)
 * @access  Private (Admin only)
 */
router.get('/', authenticate, Roles(ROLES.ADMIN), (req, res) =>
  customerController.findAll(req, res)
);

/**
 * @route   GET /api/customers/:id
 * @desc    Get customer by ID
 * @access  Private (Admin only)
 */
router.get('/:id', authenticate, Roles(ROLES.ADMIN), (req, res) =>
  customerController.findOne(req, res)
);

/**
 * @route   PUT /api/customers/:id
 * @desc    Update customer
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, Roles(ROLES.ADMIN), (req, res) =>
  customerController.update(req, res)
);

/**
 * @route   DELETE /api/customers/:id
 * @desc    Delete customer (soft delete)
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, Roles(ROLES.ADMIN), (req, res) =>
  customerController.delete(req, res)
);

export default router;
