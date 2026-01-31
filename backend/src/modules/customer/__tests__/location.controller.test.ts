import { CreateLocationUseCase } from '@customer/application/create-location.use-case';
import { DeleteLocationUseCase } from '@customer/application/delete-location.use-case';
import { GetLocationUseCase } from '@customer/application/get-location.use-case';
import { ListLocationsUseCase } from '@customer/application/list-locations.use-case';
import { UpdateLocationUseCase } from '@customer/application/update-location.use-case';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { LocationNotFoundException } from '@customer/domain/exceptions/location-not-found.exception';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';
import { LocationController } from '@customer/infrastructure/http/location.controller';
import { NotFoundException } from '@shared/exceptions/http-exceptions';
import { Request, Response } from 'express';

describe('LocationController', () => {
  let controller: LocationController;
  let createUseCase: jest.Mocked<CreateLocationUseCase>;
  let listUseCase: jest.Mocked<ListLocationsUseCase>;
  let getUseCase: jest.Mocked<GetLocationUseCase>;
  let updateUseCase: jest.Mocked<UpdateLocationUseCase>;
  let deleteUseCase: jest.Mocked<DeleteLocationUseCase>;

  let res: Response;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    createUseCase = { execute: jest.fn() } as unknown as jest.Mocked<CreateLocationUseCase>;
    updateUseCase = { execute: jest.fn() } as unknown as jest.Mocked<UpdateLocationUseCase>;
    deleteUseCase = { execute: jest.fn() } as unknown as jest.Mocked<DeleteLocationUseCase>;
    getUseCase = { execute: jest.fn() } as unknown as jest.Mocked<GetLocationUseCase>;
    listUseCase = { execute: jest.fn() } as unknown as jest.Mocked<ListLocationsUseCase>;

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    res = { status: statusMock, json: jsonMock } as unknown as Response;

    controller = new LocationController(
      createUseCase,
      updateUseCase,
      deleteUseCase,
      getUseCase,
      listUseCase
    );
  });

  describe('create', () => {
    it('should create location successfully', async () => {
      const req = {
        params: { customerId: 'cust-1' },
        body: { name: 'Office', address: '123 Main St', subCustomerId: null },
      } as unknown as Request;
      createUseCase.execute.mockResolvedValue({
        id: 'loc-1',
        customerId: 'cust-1',
        name: 'Office',
        address: '123 Main St',
        city: 'Caracas',
        zipCode: '1010',
        isMain: false,
        subCustomerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await controller.create(req, res);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ id: 'loc-1' }),
        })
      );
    });

    it('should throw NotFoundException if customer not found', async () => {
      const req = { params: { customerId: 'none' }, body: {} } as unknown as Request;
      createUseCase.execute.mockRejectedValue(new CustomerNotFoundException('none'));

      await expect(controller.create(req, res)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if subcustomer not found', async () => {
      const req = {
        params: { customerId: 'cust-1' },
        body: { subCustomerId: 'none' },
      } as unknown as Request;
      createUseCase.execute.mockRejectedValue(new SubCustomerNotFoundException('none'));

      await expect(controller.create(req, res)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated locations', async () => {
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

    it('should return paginated locations without customerId (global search)', async () => {
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
    it('should return location details', async () => {
      const req = { params: { id: 'loc-1' } } as unknown as Request;
      getUseCase.execute.mockResolvedValue({
        id: 'loc-1',
        customerId: 'cust-1',
        subCustomerId: null,
        name: 'Office',
        address: '123 Main St',
        city: 'Caracas',
        zipCode: '1010',
        isMain: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await controller.findOne(req, res);

      expect(getUseCase.execute).toHaveBeenCalledWith('loc-1');
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should throw NotFoundException if not found', async () => {
      const req = { params: { id: 'none' } } as unknown as Request;
      getUseCase.execute.mockRejectedValue(new LocationNotFoundException('none'));

      await expect(controller.findOne(req, res)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update location successfully', async () => {
      const req = { params: { id: 'loc-1' }, body: { name: 'New Name' } } as unknown as Request;
      updateUseCase.execute.mockResolvedValue({
        id: 'loc-1',
        customerId: 'cust-1',
        subCustomerId: null,
        name: 'New Name',
        address: '123 Main St',
        city: 'Caracas',
        zipCode: '1010',
        isMain: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await controller.update(req, res);

      expect(updateUseCase.execute).toHaveBeenCalledWith('loc-1', { name: 'New Name' });
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should handle NotFoundException', async () => {
      const req = { params: { id: 'none' }, body: {} } as unknown as Request;
      updateUseCase.execute.mockRejectedValue(new LocationNotFoundException('none'));

      await expect(controller.update(req, res)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete location successfully', async () => {
      const req = { params: { id: 'loc-1' } } as unknown as Request;
      deleteUseCase.execute.mockResolvedValue({
        id: 'loc-1',
        customerId: 'cust-1',
        subCustomerId: null,
        name: 'Office',
        address: '123 Main St',
        city: 'Caracas',
        zipCode: '1010',
        isMain: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await controller.delete(req, res);

      expect(deleteUseCase.execute).toHaveBeenCalledWith('loc-1');
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should handle NotFoundException', async () => {
      const req = { params: { id: 'none' } } as unknown as Request;
      deleteUseCase.execute.mockRejectedValue(new LocationNotFoundException('none'));

      await expect(controller.delete(req, res)).rejects.toThrow(NotFoundException);
    });
  });
});
