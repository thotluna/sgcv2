import { DeleteLocationUseCase } from '@customer/application/delete-location.use-case';
import { DeleteLocationService } from '@customer/domain/delete-location.service';
import { LocationNotFoundException } from '@customer/domain/exceptions/location-not-found.exception';

describe('DeleteLocationUseCase', () => {
  let useCase: DeleteLocationUseCase;
  let mockService: jest.Mocked<DeleteLocationService>;

  beforeEach(() => {
    mockService = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;
    useCase = new DeleteLocationUseCase(mockService);
  });

  describe('execute', () => {
    it('should delete location successfully', async () => {
      mockService.findById.mockResolvedValue({ id: 'loc-1' } as any);
      mockService.delete.mockResolvedValue({ id: 'loc-1' } as any);

      const result = await useCase.execute('loc-1');

      expect(mockService.findById).toHaveBeenCalledWith('loc-1');
      expect(mockService.delete).toHaveBeenCalledWith('loc-1');
      expect(result.id).toBe('loc-1');
    });

    it('should throw LocationNotFoundException if not found', async () => {
      mockService.findById.mockResolvedValue(null);
      await expect(useCase.execute('none')).rejects.toThrow(LocationNotFoundException);
    });
  });
});
