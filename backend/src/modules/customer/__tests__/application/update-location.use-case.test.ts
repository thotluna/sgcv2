import { UpdateLocationUseCase } from '@customer/application/update-location.use-case';
import { UpdateLocationService } from '@customer/domain/update-location.service';
import { LocationNotFoundException } from '@customer/domain/exceptions/location-not-found.exception';

describe('UpdateLocationUseCase', () => {
  let useCase: UpdateLocationUseCase;
  let mockService: jest.Mocked<UpdateLocationService>;

  beforeEach(() => {
    mockService = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;
    useCase = new UpdateLocationUseCase(mockService);
  });

  describe('execute', () => {
    it('should update location successfully', async () => {
      const existingLoc = { id: '1', name: 'Old Name' };
      mockService.findById.mockResolvedValue(existingLoc as any);
      mockService.update.mockResolvedValue({ ...existingLoc, name: 'New Name' } as any);

      const result = await useCase.execute('1', { name: 'New Name' });

      expect(mockService.update).toHaveBeenCalledWith('1', { name: 'New Name' });
      expect(result.name).toBe('New Name');
    });

    it('should throw LocationNotFoundException if not found', async () => {
      mockService.findById.mockResolvedValue(null);
      await expect(useCase.execute('none', {})).rejects.toThrow(LocationNotFoundException);
    });
  });
});
