import { CustomerState } from '@prisma/client';
import { CustomerController } from '../customer.controller';
import { CustomerService } from '../customer.service';
import { Request, Response } from 'express';
import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@shared/exceptions';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerService: jest.Mocked<CustomerService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    customerService = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<CustomerService>;

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    res = {
      status: statusMock,
      json: jsonMock,
    };

    customerController = new CustomerController(customerService);
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
        })
      );
    });

    it('should throw UnprocessableEntityException when validation fails', async () => {
      const invalidDto = {
        code: '',
        legalName: '',
        taxId: 'invalid',
        address: '',
      };

      req = { body: invalidDto };

      await expect(customerController.create(req as Request, res as Response)).rejects.toThrow(
        UnprocessableEntityException
      );

      expect(customerService.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when code exists', async () => {
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

      await expect(customerController.create(req as Request, res as Response)).rejects.toThrow(
        ConflictException
      );
    });

    it('should rethrow generic error', async () => {
      const customerDto = {
        code: 'C001',
        businessName: 'Test',
        legalName: 'Test',
        taxId: 'J-12345678-9',
        address: 'Test',
      };
      req = { body: customerDto };
      (customerService.create as jest.Mock).mockRejectedValue(new Error('Service error'));

      await expect(customerController.create(req as Request, res as Response)).rejects.toThrow(
        Error
      );
    });
  });

  describe('findAll', () => {
    it('should return all customers with pagination', async () => {
      req = { query: { page: '1', limit: '10' } };
      const result = {
        items: [],
        total: 0,
      };

      customerService.findAll.mockResolvedValue(result);

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

    it('should rethrow error on findAll failure', async () => {
      req = { query: {} };
      (customerService.findAll as jest.Mock).mockRejectedValue(new Error('Error'));

      await expect(customerController.findAll(req as Request, res as Response)).rejects.toThrow(
        'Error'
      );
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

    it('should throw NotFoundException when not found', async () => {
      req = { params: { id: '1' } };
      (customerService.findById as jest.Mock).mockRejectedValue(new Error('Customer not found'));

      await expect(customerController.findOne(req as Request, res as Response)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should rethrow generic error', async () => {
      req = { params: { id: '1' } };
      (customerService.findById as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(customerController.findOne(req as Request, res as Response)).rejects.toThrow(
        'DB Error'
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

    it('should throw NotFoundException when not found', async () => {
      req = { params: { id: '1' }, body: {} };
      (customerService.update as jest.Mock).mockRejectedValue(new Error('Customer not found'));

      await expect(customerController.update(req as Request, res as Response)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should rethrow generic error', async () => {
      req = { params: { id: '1' }, body: {} };
      (customerService.update as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(customerController.update(req as Request, res as Response)).rejects.toThrow(
        'DB Error'
      );
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

    it('should throw NotFoundException when not found', async () => {
      req = { params: { id: '1' } };
      (customerService.delete as jest.Mock).mockRejectedValue(new Error('Customer not found'));

      await expect(customerController.delete(req as Request, res as Response)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should rethrow generic error', async () => {
      req = { params: { id: '1' } };
      (customerService.delete as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(customerController.delete(req as Request, res as Response)).rejects.toThrow(
        'DB Error'
      );
    });
  });
});
