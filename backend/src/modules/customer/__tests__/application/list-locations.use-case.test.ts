import { ListLocationsUseCase } from '@customer/application/list-locations.use-case';
import { ListLocationsService } from '@customer/domain/list-locations.service';

describe('ListLocationsUseCase', () => {
  let useCase: ListLocationsUseCase;
  let mockService: jest.Mocked<ListLocationsService>;

  beforeEach(() => {
    mockService = {
      findAll: jest.fn(),
    } as any;
    useCase = new ListLocationsUseCase(mockService);
  });

  describe('execute', () => {
    it('should return paginated locations', async () => {
      const filters = { page: 1, limit: 10 };
      const mockResult = { items: [], total: 0 };
      mockService.findAll.mockResolvedValue(mockResult);

      const result = await useCase.execute(filters, 'cust-1');

      expect(mockService.findAll).toHaveBeenCalledWith(filters, 'cust-1');
      expect(result).toEqual(mockResult);
    });
  });
});
