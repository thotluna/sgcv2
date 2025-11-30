import { CustomerState } from '@prisma/client';
import { CustomerController } from '../customer.controller';
import { CustomerService } from '../customer.service';
import { Request, Response } from 'express';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

jest.mock('../customer.service');

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerService: jest.Mocked<CustomerService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    res = {
      status: statusMock,
      json: jsonMock,
    };

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    customerController = new CustomerController();
    customerService = (customerController as any).customerService;
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('create', () => {
    it('should create a customer successfully', async () => {
      const customerDto = {
        code: 'C001',
        businessName: 'Test Business',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
        phone: '1234567890',
      };

      req = { body: customerDto };

      const createdCustomer = {
        id: '1',
        ...customerDto,
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (customerService.create as jest.Mock).mockResolvedValue(createdCustomer);

      await customerController.create(req as Request, res as Response);

      expect(customerService.create).toHaveBeenCalledWith(customerDto);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdCustomer,
          metadata: expect.objectContaining({
            requestId: 'test-uuid-1234',
          }),
        })
      );
    });

    it('should return 422 when validation fails', async () => {
      const invalidDto = {
        code: '',
        legalName: '',
        taxId: 'invalid',
        address: '',
      };

      req = { body: invalidDto };

      await customerController.create(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(422);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'UNPROCESSABLE_ENTITY',
            message: 'Validation failed',
          }),
        })
      );
      expect(customerService.create).not.toHaveBeenCalled();
    });

    it('should return 409 when code exists', async () => {
      const customerDto = {
        code: 'C001',
        businessName: 'Test',
        legalName: 'Test',
        taxId: 'J-12345678-9',
        address: 'Test',
      };
      req = { body: customerDto };
      (customerService.create as jest.Mock).mockRejectedValue(
        new Error('Customer code already exists')
      );

      await customerController.create(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(409);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'CONFLICT',
            message: 'Customer code already exists',
          }),
        })
      );
    });

    it('should return 500 when service throws generic error', async () => {
      const customerDto = {
        code: 'C001',
        businessName: 'Test',
        legalName: 'Test',
        taxId: 'J-12345678-9',
        address: 'Test',
      };
      req = { body: customerDto };
      (customerService.create as jest.Mock).mockRejectedValue(new Error('Service error'));

      await customerController.create(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'INTERNAL_SERVER_ERROR',
          }),
        })
      );
    });
  });

  describe('findAll', () => {
    it('should return all customers with pagination', async () => {
      req = { query: { page: '1', limit: '10' } };
      const result = {
        customers: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };

      (customerService.findAll as jest.Mock).mockResolvedValue(result);

      await customerController.findAll(req as Request, res as Response);

      expect(customerService.findAll).toHaveBeenCalledWith(1, 10, { state: undefined });
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: [],
          metadata: expect.objectContaining({
            pagination: expect.objectContaining({
              page: 1,
              perPage: 10,
            }),
          }),
        })
      );
    });

    it('should return 500 on error', async () => {
      req = { query: {} };
      (customerService.findAll as jest.Mock).mockRejectedValue(new Error('Error'));

      await customerController.findAll(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
    });
  });

  describe('findOne', () => {
    it('should return a customer', async () => {
      req = { params: { id: '1' } };
      const customer = { id: '1', code: 'C001' };
      (customerService.findById as jest.Mock).mockResolvedValue(customer);

      await customerController.findOne(req as Request, res as Response);

      expect(customerService.findById).toHaveBeenCalledWith('1');
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: customer,
        })
      );
    });

    it('should return 404 when not found', async () => {
      req = { params: { id: '1' } };
      (customerService.findById as jest.Mock).mockRejectedValue(new Error('Customer not found'));

      await customerController.findOne(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'NOT_FOUND',
          }),
        })
      );
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updateDto = { businessName: 'Updated' };
      req = { params: { id: '1' }, body: updateDto };
      const updatedCustomer = { id: '1', ...updateDto };

      (customerService.update as jest.Mock).mockResolvedValue(updatedCustomer);

      await customerController.update(req as Request, res as Response);

      expect(customerService.update).toHaveBeenCalledWith('1', updateDto);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedCustomer,
        })
      );
    });

    it('should return 404 when not found', async () => {
      req = { params: { id: '1' }, body: {} };
      (customerService.update as jest.Mock).mockRejectedValue(new Error('Customer not found'));

      await customerController.update(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
    });
  });

  describe('delete', () => {
    it('should delete a customer', async () => {
      req = { params: { id: '1' } };
      const deletedCustomer = { id: '1', state: 'INACTIVE' };

      (customerService.delete as jest.Mock).mockResolvedValue(deletedCustomer);

      await customerController.delete(req as Request, res as Response);

      expect(customerService.delete).toHaveBeenCalledWith('1');
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: deletedCustomer,
        })
      );
    });

    it('should return 404 when not found', async () => {
      req = { params: { id: '1' } };
      (customerService.delete as jest.Mock).mockRejectedValue(new Error('Customer not found'));

      await customerController.delete(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
    });
  });
});
