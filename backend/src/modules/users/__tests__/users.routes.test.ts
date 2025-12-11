import request from 'supertest';
import express from 'express';
import { authenticate } from '@modules/auth/infrastructure/http/auth.middleware';
import { UsersRoutes } from '../infrastructure/http/users.routes';
import { UsersController } from '@users/infrastructure/http/user.controller';

// Define mock controller methods
const mockMe = jest.fn((_req, res) => res.json({}));
const mockGetAll = jest.fn((_req, res) => res.json([]));
const mockGetById = jest.fn((_req, res) => res.json({}));
const mockCreate = jest.fn((_req, res) => res.status(201).json({}));
const mockUpdate = jest.fn((_req, res) => res.json({}));
const mockDelete = jest.fn((_req, res) => res.json({}));

// Mock authenticate middleware
jest.mock('@modules/auth/infrastructure/http/auth.middleware', () => ({
  authenticate: jest.fn((req, _res, next) => {
    req.user = { id: 1, roles: [{ name: 'Admin' }] };
    next();
  }),
}));

// Mock RBAC service
jest.mock('../../rbac/rbac.service', () => ({
  rbacService: {
    hasRole: jest.fn().mockResolvedValue(true),
    hasPermission: jest.fn().mockResolvedValue(true),
    getUserPermissions: jest.fn().mockResolvedValue([]),
  },
}));

// Mock roles guard
jest.mock('../../rbac/guards/roles.guard', () => ({
  requireRoles: jest.fn(() => (_req: any, _res: any, next: any) => next()),
}));

// Create mock controller with mocked methods
const mockController = {
  me: mockMe,
  // getAll: mockGetAll,
  // getById: mockGetById,
  // create: mockCreate,
  // update: mockUpdate,
  // delete: mockDelete,
} as unknown as UsersController;

// Create routes instance with mock controller
const usersRoutes = new UsersRoutes(mockController);
const router = usersRoutes.getRouter();

const app = express();
app.use(express.json());
app.use('/api/users', router);

describe('Users Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users/me', () => {
    it('should call controller.me', async () => {
      await request(app).get('/api/users/me');
      expect(authenticate).toHaveBeenCalled();
      expect(mockMe).toHaveBeenCalled();
    });
  });

  describe.skip('GET /api/users', () => {
    it('should require authentication and Admin role', async () => {
      await request(app).get('/api/users');
      expect(authenticate).toHaveBeenCalled();
      expect(mockGetAll).toHaveBeenCalled();
    });
  });

  describe.skip('GET /api/users/:id', () => {
    it('should require authentication and Admin role', async () => {
      await request(app).get('/api/users/1');
      expect(authenticate).toHaveBeenCalled();
      expect(mockGetById).toHaveBeenCalled();
    });
  });

  describe.skip('POST /api/users', () => {
    it('should require authentication and Admin role', async () => {
      await request(app).post('/api/users').send({});
      expect(authenticate).toHaveBeenCalled();
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe.skip('PUT /api/users/:id', () => {
    it('should require authentication', async () => {
      await request(app).put('/api/users/1').send({});
      expect(authenticate).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe.skip('DELETE /api/users/:id', () => {
    it('should require authentication and Admin role', async () => {
      await request(app).delete('/api/users/1');
      expect(authenticate).toHaveBeenCalled();
      expect(mockDelete).toHaveBeenCalled();
    });
  });
});
