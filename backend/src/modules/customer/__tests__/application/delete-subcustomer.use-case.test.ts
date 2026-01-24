import { DeleteSubCustomerUseCase } from '@customer/application/delete-subcustomer.use-case';
import { DeleteSubCustomerService } from '@customer/domain/delete-subcustomer.service';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';

describe('DeleteSubCustomerUseCase', () => {
  let useCase: DeleteSubCustomerUseCase;
  let mockService: jest.Mocked<DeleteSubCustomerService>;

  beforeEach(() => {
    mockService = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;
    useCase = new DeleteSubCustomerUseCase(mockService);
  });

  describe('execute', () => {
    it('should delete subcustomer successfully', async () => {
      mockService.findById.mockResolvedValue({ id: 'sub-1' } as any);
      mockService.delete.mockResolvedValue({ id: 'sub-1' } as any);

      const result = await useCase.execute('sub-1');

      expect(mockService.findById).toHaveBeenCalledWith('sub-1');
      expect(mockService.delete).toHaveBeenCalledWith('sub-1');
      expect(result.id).toBe('sub-1');
    });

    it('should throw SubCustomerNotFoundException if not found', async () => {
      mockService.findById.mockResolvedValue(null);
      await expect(useCase.execute('none')).rejects.toThrow(SubCustomerNotFoundException);
    });
  });
});
