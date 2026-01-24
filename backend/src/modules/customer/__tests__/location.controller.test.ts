import { LocationController } from '@customer/infrastructure/http/location.controller';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';
import { LocationNotFoundException } from '@customer/domain/exceptions/location-not-found.exception';
import { NotFoundException } from '@shared/exceptions/http-exceptions';

describe('LocationController', () => {
  let controller: LocationController;
  let createUseCase: any;
  let listUseCase: any;
  let getUseCase: any;
  let updateUseCase: any;
  let deleteUseCase: any;

  let res: any;
  let statusMock: any;
  let jsonMock: any;

  beforeEach(() => {
    createUseCase = { execute: jest.fn() };
    updateUseCase = { execute: jest.fn() };
    deleteUseCase = { execute: jest.fn() };
    getUseCase = { execute: jest.fn() };
    listUseCase = { execute: jest.fn() };

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    res = { status: statusMock, json: jsonMock };

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
      } as any;
      createUseCase.execute.mockResolvedValue({
        id: 'loc-1',
        customerId: 'cust-1',
        name: 'Office',
        address: '123 Main St',
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
      const req = { params: { customerId: 'none' }, body: {} } as any;
      createUseCase.execute.mockRejectedValue(new CustomerNotFoundException('none'));

      await expect(controller.create(req, res)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if subcustomer not found', async () => {
      const req = { params: { customerId: 'cust-1' }, body: { subCustomerId: 'none' } } as any;
      createUseCase.execute.mockRejectedValue(new SubCustomerNotFoundException('none'));

      await expect(controller.create(req, res)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated locations', async () => {
      const req = { params: { customerId: 'cust-1' }, query: { page: 1, perPage: 10 } } as any;
      listUseCase.execute.mockResolvedValue({ items: [], total: 0 });

      await controller.findAll(req, res);

      expect(listUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 10 }),
        'cust-1'
      );
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe('findOne', () => {
    it('should return location details', async () => {
      const req = { params: { id: 'loc-1' } } as any;
      getUseCase.execute.mockResolvedValue({
        id: 'loc-1',
        customerId: 'cust-1',
        subCustomerId: null,
        name: 'Office',
        address: '123 Main St',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await controller.findOne(req, res);

      expect(getUseCase.execute).toHaveBeenCalledWith('loc-1');
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should throw NotFoundException if not found', async () => {
      const req = { params: { id: 'none' } } as any;
      getUseCase.execute.mockRejectedValue(new LocationNotFoundException('none'));

      await expect(controller.findOne(req, res)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update location successfully', async () => {
      const req = { params: { id: 'loc-1' }, body: { name: 'New Name' } } as any;
      updateUseCase.execute.mockResolvedValue({
        id: 'loc-1',
        customerId: 'cust-1',
        subCustomerId: null,
        name: 'New Name',
        address: '123 Main St',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await controller.update(req, res);

      expect(updateUseCase.execute).toHaveBeenCalledWith('loc-1', { name: 'New Name' });
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should handle NotFoundException', async () => {
      const req = { params: { id: 'none' }, body: {} } as any;
      updateUseCase.execute.mockRejectedValue(new LocationNotFoundException('none'));

      await expect(controller.update(req, res)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete location successfully', async () => {
      const req = { params: { id: 'loc-1' } } as any;
      deleteUseCase.execute.mockResolvedValue({
        id: 'loc-1',
        customerId: 'cust-1',
        subCustomerId: null,
        name: 'Office',
        address: '123 Main St',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await controller.delete(req, res);

      expect(deleteUseCase.execute).toHaveBeenCalledWith('loc-1');
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should handle NotFoundException', async () => {
      const req = { params: { id: 'none' } } as any;
      deleteUseCase.execute.mockRejectedValue(new LocationNotFoundException('none'));

      await expect(controller.delete(req, res)).rejects.toThrow(NotFoundException);
    });
  });
});
