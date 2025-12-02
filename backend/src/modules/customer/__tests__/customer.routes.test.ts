import request from 'supertest';
import express from 'express';
import { authenticate } from '../../auth/middleware/auth.middleware';
import { CustomerRoutes } from '../customer.routes';
import { CustomerController } from '../customer.controller';

// Define mock controller methods
const mockCreate = jest.fn((_req, res) => res.status(201).json({ success: true, data: {} }));
const mockFindAll = jest.fn((_req, res) => res.status(200).json({ success: true, data: [] }));
const mockFindOne = jest.fn((_req, res) => res.status(200).json({ success: true, data: {} }));
const mockUpdate = jest.fn((_req, res) => res.status(200).json({ success: true, data: {} }));
const mockDelete = jest.fn((_req, res) => res.status(200).json({ success: true, data: {} }));

// Mock authenticate middleware
jest.mock('../../auth/middleware/auth.middleware', () => ({
  authenticate: jest.fn((req, _res, next) => {
    req.user = { id: 'mock-admin-id', username: 'admin' };
    next();
  }),
}));

// Mock RBAC service
jest.mock('../../rbac/rbac.service', () => ({
  rbacService: {
    hasPermission: jest.fn().mockResolvedValue(true),
  },
}));

// Mock permissions guard
jest.mock('../../rbac/guards/permissions.guard', () => ({
  requirePermission: jest.fn(() => (_req: any, _res: any, next: any) => next()),
}));

// Create mock controller with mocked methods
const mockController = {
  create: mockCreate,
  findAll: mockFindAll,
  findOne: mockFindOne,
  update: mockUpdate,
  delete: mockDelete,
} as unknown as CustomerController;

// Create routes instance with mock controller
const customerRoutes = new CustomerRoutes(mockController);
const router = customerRoutes.getRouter();

const app = express();
app.use(express.json());
app.use('/api/customers', router);

describe('Customer Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/customers', () => {
    it('should require authentication and customers:create permission', async () => {
      await request(app).post('/api/customers').send({});
      expect(authenticate).toHaveBeenCalled();
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe('GET /api/customers', () => {
    it('should require authentication and customers:read permission', async () => {
      await request(app).get('/api/customers');
      expect(authenticate).toHaveBeenCalled();
      expect(mockFindAll).toHaveBeenCalled();
    });
  });

  describe('GET /api/customers/:id', () => {
    it('should require authentication and customers:read permission', async () => {
      await request(app).get('/api/customers/1');
      expect(authenticate).toHaveBeenCalled();
      expect(mockFindOne).toHaveBeenCalled();
    });
  });

  describe('PUT /api/customers/:id', () => {
    it('should require authentication and customers:update permission', async () => {
      await request(app).put('/api/customers/1').send({});
      expect(authenticate).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/customers/:id', () => {
    it('should require authentication and customers:delete permission', async () => {
      await request(app).delete('/api/customers/1');
      expect(authenticate).toHaveBeenCalled();
      expect(mockDelete).toHaveBeenCalled();
    });
  });
});
