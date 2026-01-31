import { CreateSubCustomerUseCase } from '@customer/application/create-subcustomer.use-case';
import { DeleteSubCustomerUseCase } from '@customer/application/delete-subcustomer.use-case';
import { GetSubCustomerUseCase } from '@customer/application/get-subcustomer.use-case';
import { ListSubCustomersUseCase } from '@customer/application/list-subcustomers.use-case';
import { UpdateSubCustomerUseCase } from '@customer/application/update-subcustomer.use-case';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { SubCustomerAlreadyExistsException } from '@customer/domain/exceptions/subcustomer-already-exists.exception';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';
import { SubCustomerController } from '@customer/infrastructure/http/subcustomer.controller';
import { ConflictException, NotFoundException } from '@shared/exceptions/http-exceptions';
import { Request, Response } from 'express';

describe('SubCustomerController', () => {
  let controller: SubCustomerController;
  let createUseCase: jest.Mocked<CreateSubCustomerUseCase>;
  let listUseCase: jest.Mocked<ListSubCustomersUseCase>;
  let getUseCase: jest.Mocked<GetSubCustomerUseCase>;
  let updateUseCase: jest.Mocked<UpdateSubCustomerUseCase>;
  let deleteUseCase: jest.Mocked<DeleteSubCustomerUseCase>;

  let res: Response;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    createUseCase = { execute: jest.fn() } as unknown as jest.Mocked<CreateSubCustomerUseCase>;
    listUseCase = { execute: jest.fn() } as unknown as jest.Mocked<ListSubCustomersUseCase>;
    getUseCase = { execute: jest.fn() } as unknown as jest.Mocked<GetSubCustomerUseCase>;
    updateUseCase = { execute: jest.fn() } as unknown as jest.Mocked<UpdateSubCustomerUseCase>;
    deleteUseCase = { execute: jest.fn() } as unknown as jest.Mocked<DeleteSubCustomerUseCase>;

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    res = { status: statusMock, json: jsonMock } as unknown as Response;

    controller = new SubCustomerController(
      createUseCase,
      listUseCase,
      getUseCase,
      updateUseCase,
      deleteUseCase
    );
  });

  describe('create', () => {
    it('should create subcustomer successfully', async () => {
      const req = {
        params: { customerId: 'cust-1' },
        body: { businessName: 'Sub 1', externalCode: 'EXT' },
      } as unknown as Request;
      createUseCase.execute.mockResolvedValue({
        id: 'sub-1',
        customerId: 'cust-1',
        businessName: 'Sub 1',
        externalCode: 'EXT',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await controller.create(req, res);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ id: 'sub-1' }),
        })
      );
    });

    it('should throw NotFoundException if customer not found', async () => {
      const req = { params: { customerId: 'none' }, body: {} } as unknown as Request;
      createUseCase.execute.mockRejectedValue(new CustomerNotFoundException('none'));

      await expect(controller.create(req, res)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if already exists', async () => {
      const req = { params: { customerId: 'cust-1' }, body: {} } as unknown as Request;
      createUseCase.execute.mockRejectedValue(
        new SubCustomerAlreadyExistsException('cust-1', 'EXT')
      );

      await expect(controller.create(req, res)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated subcustomers', async () => {
      const req = {
        params: { customerId: 'cust-1' },
        query: { page: 1, perPage: 10 },
      } as unknown as Request;
      listUseCase.execute.mockResolvedValue({ items: [], total: 0 });

      await controller.findAll(req, res);

      expect(listUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 10 }),
        'cust-1'
      );
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should return paginated sub-customers without customerId (global search)', async () => {
      const req = { params: {}, query: { page: 1, perPage: 10 } } as unknown as Request;
      listUseCase.execute.mockResolvedValue({ items: [], total: 0 });

      await controller.findAll(req, res);

      expect(listUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 10 }),
        undefined
      );
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should use customerId from query if not in params', async () => {
      const req = {
        params: {},
        query: { customerId: 'cust-2', page: 1, perPage: 10 },
      } as unknown as Request;
      listUseCase.execute.mockResolvedValue({ items: [], total: 0 });

      await controller.findAll(req, res);

      expect(listUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 10 }),
        'cust-2'
      );
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe('findOne', () => {
    it('should return subcustomer details', async () => {
      const req = { params: { id: 'sub-1' } } as unknown as Request;
      getUseCase.execute.mockResolvedValue({
        id: 'sub-1',
        customerId: 'cust-1',
        businessName: 'Sub 1',
        externalCode: 'EXT-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await controller.findOne(req, res);

      expect(getUseCase.execute).toHaveBeenCalledWith('sub-1');
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should throw NotFoundException if not found', async () => {
      const req = { params: { id: 'none' } } as unknown as Request;
      getUseCase.execute.mockRejectedValue(new SubCustomerNotFoundException('none'));

      await expect(controller.findOne(req, res)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update subcustomer successfully', async () => {
      const req = {
        params: { id: 'sub-1' },
        body: { businessName: 'New Name' },
      } as unknown as Request;
      updateUseCase.execute.mockResolvedValue({
        id: 'sub-1',
        customerId: 'cust-1',
        businessName: 'New Name',
        externalCode: 'EXT-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await controller.update(req, res);

      expect(updateUseCase.execute).toHaveBeenCalledWith('sub-1', { businessName: 'New Name' });
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should handle NotFoundException', async () => {
      const req = { params: { id: 'none' }, body: {} } as unknown as Request;
      updateUseCase.execute.mockRejectedValue(new SubCustomerNotFoundException('none'));

      await expect(controller.update(req, res)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete subcustomer successfully', async () => {
      const req = { params: { id: 'sub-1' } } as unknown as Request;
      deleteUseCase.execute.mockResolvedValue({
        id: 'sub-1',
        customerId: 'cust-1',
        businessName: 'Sub 1',
        externalCode: 'EXT-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await controller.delete(req, res);

      expect(deleteUseCase.execute).toHaveBeenCalledWith('sub-1');
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should handle NotFoundException', async () => {
      const req = { params: { id: 'none' } } as unknown as Request;
      deleteUseCase.execute.mockRejectedValue(new SubCustomerNotFoundException('none'));

      await expect(controller.delete(req, res)).rejects.toThrow(NotFoundException);
    });
  });
});
