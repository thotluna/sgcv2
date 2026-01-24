import { GetLocationUseCase } from '@customer/application/get-location.use-case';
import { GetLocationService } from '@customer/domain/get-location.service';
import { LocationNotFoundException } from '@customer/domain/exceptions/location-not-found.exception';

describe('GetLocationUseCase', () => {
  let useCase: GetLocationUseCase;
  let mockService: jest.Mocked<GetLocationService>;

  beforeEach(() => {
    mockService = {
      findById: jest.fn(),
    } as any;
    useCase = new GetLocationUseCase(mockService);
  });

  describe('execute', () => {
    it('should return location successfully', async () => {
      mockService.findById.mockResolvedValue({ id: 'loc-1', name: 'Office' } as any);

      const result = await useCase.execute('loc-1');

      expect(mockService.findById).toHaveBeenCalledWith('loc-1');
      expect(result.id).toBe('loc-1');
    });

    it('should throw LocationNotFoundException if not found', async () => {
      mockService.findById.mockResolvedValue(null);
      await expect(useCase.execute('none')).rejects.toThrow(LocationNotFoundException);
    });
  });
});
