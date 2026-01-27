import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { SubCustomerAlreadyExistsException } from '@customer/domain/exceptions/subcustomer-already-exists.exception';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';
import { SubCustomerController } from '@customer/infrastructure/http/subcustomer.controller';
import { ConflictException, NotFoundException } from '@shared/exceptions/http-exceptions';

describe('SubCustomerController', () => {
  let controller: SubCustomerController;
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
    listUseCase = { execute: jest.fn() };
    getUseCase = { execute: jest.fn() };
    updateUseCase = { execute: jest.fn() };
    deleteUseCase = { execute: jest.fn() };

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    res = { status: statusMock, json: jsonMock };

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
      } as any;
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
      const req = { params: { customerId: 'none' }, body: {} } as any;
      createUseCase.execute.mockRejectedValue(new CustomerNotFoundException('none'));

      await expect(controller.create(req, res)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if already exists', async () => {
      const req = { params: { customerId: 'cust-1' }, body: {} } as any;
      createUseCase.execute.mockRejectedValue(
        new SubCustomerAlreadyExistsException('cust-1', 'EXT')
      );

      await expect(controller.create(req, res)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated subcustomers', async () => {
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
    it('should return subcustomer details', async () => {
      const req = { params: { id: 'sub-1' } } as any;
      getUseCase.execute.mockResolvedValue({ id: 'sub-1', businessName: 'Sub 1' });

      await controller.findOne(req, res);

      expect(getUseCase.execute).toHaveBeenCalledWith('sub-1');
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should throw NotFoundException if not found', async () => {
      const req = { params: { id: 'none' } } as any;
      getUseCase.execute.mockRejectedValue(new SubCustomerNotFoundException('none'));

      await expect(controller.findOne(req, res)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update subcustomer successfully', async () => {
      const req = { params: { id: 'sub-1' }, body: { businessName: 'New Name' } } as any;
      updateUseCase.execute.mockResolvedValue({ id: 'sub-1', businessName: 'New Name' });

      await controller.update(req, res);

      expect(updateUseCase.execute).toHaveBeenCalledWith('sub-1', { businessName: 'New Name' });
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should handle NotFoundException', async () => {
      const req = { params: { id: 'none' }, body: {} } as any;
      updateUseCase.execute.mockRejectedValue(new SubCustomerNotFoundException('none'));

      await expect(controller.update(req, res)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete subcustomer successfully', async () => {
      const req = { params: { id: 'sub-1' } } as any;
      deleteUseCase.execute.mockResolvedValue({ id: 'sub-1' });

      await controller.delete(req, res);

      expect(deleteUseCase.execute).toHaveBeenCalledWith('sub-1');
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should handle NotFoundException', async () => {
      const req = { params: { id: 'none' } } as any;
      deleteUseCase.execute.mockRejectedValue(new SubCustomerNotFoundException('none'));

      await expect(controller.delete(req, res)).rejects.toThrow(NotFoundException);
    });
  });
});
