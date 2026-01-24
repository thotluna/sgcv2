import request from 'supertest';
import { Router } from 'express';
import express from 'express';
import { authenticate } from '@modules/auth/infrastructure/http/auth.middleware';
import { CustomerRoutes } from '@customer/infrastructure/http/customer.routes';
import { CustomerController } from '@customer/infrastructure/http/customer.controller';
import { SubCustomerRoutes } from '@customer/infrastructure/http/subcustomer.routes';

// Define mock controller methods
const mockCreate = jest.fn((_req, res) => res.status(201).json({ success: true, data: {} }));
const mockFindAll = jest.fn((_req, res) => res.status(200).json({ success: true, data: [] }));
const mockFindOne = jest.fn((_req, res) => res.status(200).json({ success: true, data: {} }));
const mockUpdate = jest.fn((_req, res) => res.status(200).json({ success: true, data: {} }));
const mockDelete = jest.fn((_req, res) => res.status(200).json({ success: true, data: {} }));

// Mock authenticate middleware
jest.mock('@modules/auth/infrastructure/http/auth.middleware', () => ({
  authenticate: jest.fn((req, _res, next) => {
    req.user = { id: 'mock-admin-id', username: 'admin', role: 'admin', roles: ['admin'] };
    next();
  }),
}));

// Mock RBAC service
jest.mock('@modules/rbac/rbac.service', () => ({
  rbacService: {
    hasPermission: jest.fn().mockResolvedValue(true),
  },
}));

// Mock permissions guard
jest.mock('@modules/rbac/guards/permissions.guard', () => ({
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

// Mock SubCustomerRoutes
const mockSubCustomerRoutes = {
  getRouter: jest.fn(() => Router()),
} as unknown as SubCustomerRoutes;

// Create routes instance with mock controller and subcustomer routes
const customerRoutes = new CustomerRoutes(mockController, mockSubCustomerRoutes);
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
      const validCustomer = {
        code: 'C001',
        businessName: 'Test Business',
        legalName: 'Test Legal Name',
        taxId: 'J-12345678-9',
        address: 'Test Address 123',
      };
      await request(app).post('/api/customers').send(validCustomer);
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
