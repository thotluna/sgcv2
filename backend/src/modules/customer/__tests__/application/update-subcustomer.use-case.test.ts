import { UpdateSubCustomerUseCase } from '@customer/application/update-subcustomer.use-case';
import { UpdateSubCustomerService } from '@customer/domain/update-subcustomer.service';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';
import { SubCustomerAlreadyExistsException } from '@customer/domain/exceptions/subcustomer-already-exists.exception';

describe('UpdateSubCustomerUseCase', () => {
  let useCase: UpdateSubCustomerUseCase;
  let mockService: jest.Mocked<UpdateSubCustomerService>;

  beforeEach(() => {
    mockService = {
      findById: jest.fn(),
      findByExternalCode: jest.fn(),
      update: jest.fn(),
    } as any;
    useCase = new UpdateSubCustomerUseCase(mockService);
  });

  describe('execute', () => {
    it('should update subcustomer successfully', async () => {
      const existingSub = { id: '1', customerId: 'cust-1', externalCode: 'OLD' };
      mockService.findById.mockResolvedValue(existingSub as any);
      mockService.update.mockResolvedValue({ ...existingSub, businessName: 'New' } as any);

      const result = await useCase.execute('1', { businessName: 'New' });

      expect(mockService.update).toHaveBeenCalledWith('1', { businessName: 'New' });
      expect(result.businessName).toBe('New');
    });

    it('should check for external code duplication if changed', async () => {
      const existingSub = { id: '1', customerId: 'cust-1', externalCode: 'OLD' };
      mockService.findById.mockResolvedValue(existingSub as any);
      mockService.findByExternalCode.mockResolvedValue(null);
      mockService.update.mockResolvedValue({ ...existingSub, externalCode: 'NEW' } as any);

      await useCase.execute('1', { externalCode: 'NEW' });

      expect(mockService.findByExternalCode).toHaveBeenCalledWith('cust-1', 'NEW');
    });

    it('should throw SubCustomerAlreadyExistsException if new external code exists', async () => {
      const existingSub = { id: '1', customerId: 'cust-1', externalCode: 'OLD' };
      mockService.findById.mockResolvedValue(existingSub as any);
      mockService.findByExternalCode.mockResolvedValue({ id: 'other' } as any);

      await expect(useCase.execute('1', { externalCode: 'NEW' })).rejects.toThrow(
        SubCustomerAlreadyExistsException
      );
    });

    it('should throw SubCustomerNotFoundException if not found', async () => {
      mockService.findById.mockResolvedValue(null);
      await expect(useCase.execute('none', {})).rejects.toThrow(SubCustomerNotFoundException);
    });
  });
});
