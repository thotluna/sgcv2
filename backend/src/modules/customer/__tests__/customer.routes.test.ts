import request from 'supertest';
import express, { Application } from 'express';
import { CustomerService } from '../customer.service';
import { CustomerState } from '@prisma/client';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

jest.mock('../customer.service');

// Mock del middleware de autenticación: adjunta un usuario a la petición
jest.mock('../../auth/middleware/auth.middleware', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { id: 'mock-admin-user-id', username: 'admin-test' };
    next();
  },
}));

// Mock del servicio RBAC: simula que el usuario siempre tiene el rol requerido
jest.mock('../../rbac/rbac.service', () => ({
  rbacService: {
    hasRole: jest.fn().mockResolvedValue(true),
  },
}));

const mockCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindById = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

(CustomerService as jest.Mock).mockImplementation(() => ({
  create: mockCreate,
  findAll: mockFindAll,
  findById: mockFindById,
  update: mockUpdate,
  delete: mockDelete,
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const customerRouter = require('../customer.routes').default;

function createApp(): Application {
  const app = express();
  app.use(express.json());
  app.use('/api/customers', customerRouter);
  return app;
}

describe('Customer Routes', () => {
  let consoleErrorSpy: jest.SpyInstance;
  const app = createApp();

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  describe('POST /api/customers', () => {
    it('should create a customer successfully', async () => {
      const customerDto = {
        code: 'C001',
        businessName: 'Test Business',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
        phone: '1234567890',
      };

      const createdCustomer = {
        id: '1',
        ...customerDto,
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreate.mockResolvedValue(createdCustomer);

      const response = await request(app)
        .post('/api/customers')
        .send(customerDto)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: '1',
        code: 'C001',
        businessName: 'Test Business',
      });
      expect(response.body.metadata).toHaveProperty('timestamp');
      expect(response.body.metadata).toHaveProperty('requestId');
      expect(mockCreate).toHaveBeenCalledWith(customerDto);
    });

    it('should return 422 when validation fails', async () => {
      const invalidDto = {
        code: 'AB', // Too short
        legalName: 'Test',
        taxId: 'invalid',
        address: 'Test',
      };

      const response = await request(app)
        .post('/api/customers')
        .send(invalidDto)
        .set('Accept', 'application/json');

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'UNPROCESSABLE_ENTITY');
      expect(response.body.error).toHaveProperty('message', 'Validation failed');
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/customers', () => {
    it('should return all customers with pagination', async () => {
      const result = {
        customers: [
          {
            id: '1',
            code: 'C001',
            businessName: 'Customer 1',
            legalName: 'Legal 1',
            taxId: 'J-12345678-9',
            address: 'Address 1',
            phone: '1234567890',
            state: CustomerState.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockFindAll.mockResolvedValue(result);

      const response = await request(app).get('/api/customers').set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.metadata.pagination).toMatchObject({
        page: 1,
        perPage: 10,
        total: 1,
        totalPages: 1,
      });
      expect(mockFindAll).toHaveBeenCalledWith(1, 10, { state: undefined });
    });

    it('should filter by state', async () => {
      const result = {
        customers: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };

      mockFindAll.mockResolvedValue(result);

      const response = await request(app)
        .get('/api/customers?state=ACTIVE')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockFindAll).toHaveBeenCalledWith(1, 10, { state: 'ACTIVE' });
    });
  });

  describe('GET /api/customers/:id', () => {
    it('should return a customer by id', async () => {
      const customer = {
        id: '1',
        code: 'C001',
        businessName: 'Test Business',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
        phone: '1234567890',
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFindById.mockResolvedValue(customer);

      const response = await request(app).get('/api/customers/1').set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: '1',
        code: 'C001',
      });
      expect(mockFindById).toHaveBeenCalledWith('1');
    });

    it('should return 404 when customer not found', async () => {
      mockFindById.mockRejectedValue(new Error('Customer not found'));

      const response = await request(app)
        .get('/api/customers/999')
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
      expect(response.body.error).toHaveProperty('message', 'Customer not found');
    });
  });

  describe('PUT /api/customers/:id', () => {
    it('should update a customer successfully', async () => {
      const updateDto = {
        businessName: 'Updated Business',
      };

      const updatedCustomer = {
        id: '1',
        code: 'C001',
        businessName: 'Updated Business',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
        phone: '1234567890',
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUpdate.mockResolvedValue(updatedCustomer);

      const response = await request(app)
        .put('/api/customers/1')
        .send(updateDto)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: '1',
        businessName: 'Updated Business',
      });
      expect(mockUpdate).toHaveBeenCalledWith('1', updateDto);
    });

    it('should return 404 when customer not found', async () => {
      mockUpdate.mockRejectedValue(new Error('Customer not found'));

      const response = await request(app)
        .put('/api/customers/999')
        .send({ businessName: 'Updated' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    });
  });

  describe('DELETE /api/customers/:id', () => {
    it('should soft delete a customer successfully', async () => {
      const deletedCustomer = {
        id: '1',
        state: CustomerState.INACTIVE,
      };

      mockDelete.mockResolvedValue(deletedCustomer);

      const response = await request(app)
        .delete('/api/customers/1')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: '1',
        state: 'INACTIVE',
      });
      expect(mockDelete).toHaveBeenCalledWith('1');
    });

    it('should return 404 when customer not found', async () => {
      mockDelete.mockRejectedValue(new Error('Customer not found'));

      const response = await request(app)
        .delete('/api/customers/999')
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    });
  });
});
