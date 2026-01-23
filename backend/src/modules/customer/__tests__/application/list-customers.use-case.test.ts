import { ListCustomersUseCase } from '@customer/application/list-customers.use-case';
import { ListCustomersService } from '@customer/domain/list-customers.service';
import { CustomerEntity, CustomerState } from '@customer/domain/customer.entity';
import { CustomerFilterInput } from '@customer/domain/inputs/customer.input';

describe('ListCustomersUseCase', () => {
  let useCase: ListCustomersUseCase;
  let mockService: jest.Mocked<ListCustomersService>;

  beforeEach(() => {
    mockService = {
      findAll: jest.fn(),
    } as jest.Mocked<ListCustomersService>;

    useCase = new ListCustomersUseCase(mockService);
  });

  describe('execute', () => {
    it('should return paginated customers', async () => {
      const filters: CustomerFilterInput = {
        page: 1,
        limit: 10,
      };

      const mockCustomers: CustomerEntity[] = [
        {
          id: '1',
          code: 'C001',
          businessName: 'Business 1',
          legalName: 'Legal 1',
          taxId: 'J-11111111-1',
          address: 'Address 1',
          phone: null,
          state: CustomerState.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          code: 'C002',
          businessName: 'Business 2',
          legalName: 'Legal 2',
          taxId: 'J-22222222-2',
          address: 'Address 2',
          phone: null,
          state: CustomerState.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockResult = {
        items: mockCustomers,
        total: 2,
      };

      mockService.findAll.mockResolvedValue(mockResult);

      const result = await useCase.execute(filters);

      expect(mockService.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should return empty list when no customers found', async () => {
      const filters: CustomerFilterInput = {
        page: 1,
        limit: 10,
      };

      const mockResult = {
        items: [],
        total: 0,
      };

      mockService.findAll.mockResolvedValue(mockResult);

      const result = await useCase.execute(filters);

      expect(mockService.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should apply state filter', async () => {
      const filters: CustomerFilterInput = {
        page: 1,
        limit: 10,
        state: CustomerState.ACTIVE,
      };

      const mockResult = {
        items: [],
        total: 0,
      };

      mockService.findAll.mockResolvedValue(mockResult);

      await useCase.execute(filters);

      expect(mockService.findAll).toHaveBeenCalledWith(filters);
    });

    it('should apply search filter', async () => {
      const filters: CustomerFilterInput = {
        page: 1,
        limit: 10,
        search: 'test',
      };

      const mockResult = {
        items: [],
        total: 0,
      };

      mockService.findAll.mockResolvedValue(mockResult);

      await useCase.execute(filters);

      expect(mockService.findAll).toHaveBeenCalledWith(filters);
    });
  });
});
