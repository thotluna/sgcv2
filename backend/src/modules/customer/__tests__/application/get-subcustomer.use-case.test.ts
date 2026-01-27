import { GetSubCustomerUseCase } from '@customer/application/get-subcustomer.use-case';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';
import { GetSubCustomerService } from '@customer/domain/get-subcustomer.service';

describe('GetSubCustomerUseCase', () => {
  let useCase: GetSubCustomerUseCase;
  let mockService: jest.Mocked<GetSubCustomerService>;

  beforeEach(() => {
    mockService = {
      findById: jest.fn(),
    } as any;
    useCase = new GetSubCustomerUseCase(mockService);
  });

  describe('execute', () => {
    it('should return subcustomer successfully', async () => {
      mockService.findById.mockResolvedValue({ id: 'sub-1' } as any);

      const result = await useCase.execute('sub-1');

      expect(mockService.findById).toHaveBeenCalledWith('sub-1');
      expect(result.id).toBe('sub-1');
    });

    it('should throw SubCustomerNotFoundException if not found', async () => {
      mockService.findById.mockResolvedValue(null);
      await expect(useCase.execute('none')).rejects.toThrow(SubCustomerNotFoundException);
    });
  });
});
