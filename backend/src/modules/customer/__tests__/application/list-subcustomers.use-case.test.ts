import { ListSubCustomersUseCase } from '@customer/application/list-subcustomers.use-case';
import { ListSubCustomersService } from '@customer/domain/list-subcustomers.service';

describe('ListSubCustomersUseCase', () => {
  let useCase: ListSubCustomersUseCase;
  let mockService: jest.Mocked<ListSubCustomersService>;

  beforeEach(() => {
    mockService = {
      findAll: jest.fn(),
    } as any;
    useCase = new ListSubCustomersUseCase(mockService);
  });

  describe('execute', () => {
    it('should return paginated subcustomers', async () => {
      const filters = { page: 1, limit: 10 };
      const mockResult = { items: [], total: 0 };
      mockService.findAll.mockResolvedValue(mockResult);

      const result = await useCase.execute(filters, 'cust-1');

      expect(mockService.findAll).toHaveBeenCalledWith(filters, 'cust-1');
      expect(result).toEqual(mockResult);
    });
  });
});
