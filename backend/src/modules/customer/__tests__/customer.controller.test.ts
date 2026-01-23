import { CustomerController } from '@customer/infrastructure/http/customer.controller';
import { CustomerMapper } from '@customer/infrastructure/mappers/customer.mapper';
import { CustomerState } from '@customer/domain/customer.entity';
import { Request, Response } from 'express';
import { ConflictException, NotFoundException } from '@shared/exceptions/http-exceptions';
import { CreateCustomerUseCase } from '@customer/application/create-customer.use-case';
import { ListCustomersUseCase } from '@customer/application/list-customers.use-case';
import { GetCustomerUseCase } from '@customer/application/get-customer.use-case';
import { UpdateCustomerUseCase } from '@customer/application/update-customer.use-case';
import { DeleteCustomerUseCase } from '@customer/application/delete-customer.use-case';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { CustomerAlreadyExistsException } from '@customer/domain/exceptions/customer-already-exists.exception';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

describe('CustomerController', () => {
  let customerController: CustomerController;
  let createUseCase: jest.Mocked<CreateCustomerUseCase>;
  let listUseCase: jest.Mocked<ListCustomersUseCase>;
  let getUseCase: jest.Mocked<GetCustomerUseCase>;
  let updateUseCase: jest.Mocked<UpdateCustomerUseCase>;
  let deleteUseCase: jest.Mocked<DeleteCustomerUseCase>;

  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    createUseCase = { execute: jest.fn() } as any;
    listUseCase = { execute: jest.fn() } as any;
    getUseCase = { execute: jest.fn() } as any;
    updateUseCase = { execute: jest.fn() } as any;
    deleteUseCase = { execute: jest.fn() } as any;

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    res = {
      status: statusMock,
      json: jsonMock,
    };

    customerController = new CustomerController(
      createUseCase,
      listUseCase,
      getUseCase,
      updateUseCase,
      deleteUseCase
    );
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

      createUseCase.execute.mockResolvedValue(createdCustomer as any);

      await customerController.create(req as Request, res as Response);

      expect(createUseCase.execute).toHaveBeenCalledWith(customerDto);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: CustomerMapper.toDto(createdCustomer as any),
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
        Error
      );

      expect(createUseCase.execute).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when customer already exists', async () => {
      const customerDto = {
        code: 'C001',
        businessName: 'Test',
        legalName: 'Test',
        taxId: 'J-12345678-9',
        address: 'Test',
      };
      req = { body: customerDto };
      createUseCase.execute.mockRejectedValue(new CustomerAlreadyExistsException('code', 'C001'));

      await expect(customerController.create(req as Request, res as Response)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe('findAll', () => {
    it('should return all customers with pagination', async () => {
      req = { query: { page: 1, perPage: 10 } as any };
      const result = {
        items: [],
        total: 0,
      };

      listUseCase.execute.mockResolvedValue(result as any);

      await customerController.findAll(req as Request, res as Response);

      expect(listUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        state: undefined,
        search: undefined,
      });
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
  });

  describe('findOne', () => {
    it('should return a customer', async () => {
      req = { params: { id: '1' } };
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
      getUseCase.execute.mockResolvedValue(customer as any);

      await customerController.findOne(req as Request, res as Response);

      expect(getUseCase.execute).toHaveBeenCalledWith('1');
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: CustomerMapper.toDto(customer as any),
        })
      );
    });

    it('should throw NotFoundException when not found', async () => {
      req = { params: { id: '1' } };
      getUseCase.execute.mockRejectedValue(new CustomerNotFoundException('1'));

      await expect(customerController.findOne(req as Request, res as Response)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updateDto = { businessName: 'Updated' };
      req = { params: { id: '1' }, body: updateDto };
      const updatedCustomer = {
        id: '1',
        code: 'C001',
        businessName: 'Updated',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
        phone: '1234567890',
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      updateUseCase.execute.mockResolvedValue(updatedCustomer as any);

      await customerController.update(req as Request, res as Response);

      expect(updateUseCase.execute).toHaveBeenCalledWith('1', updateDto);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: CustomerMapper.toDto(updatedCustomer as any),
        })
      );
    });

    it('should throw NotFoundException when not found', async () => {
      req = { params: { id: '1' }, body: {} };
      updateUseCase.execute.mockRejectedValue(new CustomerNotFoundException('1'));

      await expect(customerController.update(req as Request, res as Response)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('delete', () => {
    it('should delete a customer', async () => {
      req = { params: { id: '1' } };
      const deletedCustomer = {
        id: '1',
        code: 'C001',
        businessName: 'Test Business',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
        phone: '1234567890',
        state: CustomerState.INACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      deleteUseCase.execute.mockResolvedValue(deletedCustomer as any);

      await customerController.delete(req as Request, res as Response);

      expect(deleteUseCase.execute).toHaveBeenCalledWith('1');
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: CustomerMapper.toDto(deletedCustomer as any),
        })
      );
    });

    it('should throw NotFoundException when not found', async () => {
      req = { params: { id: '1' } };
      deleteUseCase.execute.mockRejectedValue(new CustomerNotFoundException('1'));

      await expect(customerController.delete(req as Request, res as Response)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
