import { SubCustomerController } from '@customer/infrastructure/http/subcustomer.controller';
import { SubCustomerRoutes } from '@customer/infrastructure/http/subcustomer.routes';
import { authenticate } from '@modules/auth/infrastructure/http/auth.middleware';
import express, { NextFunction, Request, Response } from 'express';
import request from 'supertest';

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

// Mock permissions guard
jest.mock('@modules/rbac/guards/permissions.guard', () => ({
  requirePermission: jest.fn(() => (_req: Request, _res: Response, next: NextFunction) => next()),
}));

// Create mock controller with mocked methods
const mockController = {
  create: mockCreate,
  findAll: mockFindAll,
  findOne: mockFindOne,
  update: mockUpdate,
  delete: mockDelete,
} as unknown as SubCustomerController;

const subCustomerRoutes = new SubCustomerRoutes(mockController);
const router = subCustomerRoutes.getRouter();

const app = express();
app.use(express.json());
app.use('/api/sub-customers', router);

describe('SubCustomer Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Global Routes (no customer context)', () => {
    describe('GET /api/sub-customers', () => {
      it('should require authentication and call findAll', async () => {
        await request(app).get('/api/sub-customers');
        expect(authenticate).toHaveBeenCalled();
        expect(mockFindAll).toHaveBeenCalled();
      });
    });

    describe('GET /api/sub-customers/:id', () => {
      it('should require authentication and call findOne', async () => {
        await request(app).get('/api/sub-customers/1');
        expect(authenticate).toHaveBeenCalled();
        expect(mockFindOne).toHaveBeenCalled();
      });
    });

    describe('PUT /api/sub-customers/:id', () => {
      it('should require authentication and call update', async () => {
        await request(app).put('/api/sub-customers/1').send({ businessName: 'New Name' });
        expect(authenticate).toHaveBeenCalled();
        expect(mockUpdate).toHaveBeenCalled();
      });
    });

    describe('DELETE /api/sub-customers/:id', () => {
      it('should require authentication and call delete', async () => {
        await request(app).delete('/api/sub-customers/1');
        expect(authenticate).toHaveBeenCalled();
        expect(mockDelete).toHaveBeenCalled();
      });
    });
  });
});
