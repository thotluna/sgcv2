import { CreateLocationUseCase } from '@customer/application/create-location.use-case';
import { CreateLocationService } from '@customer/domain/create-location.service';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { SubCustomerNotFoundException } from '@customer/domain/exceptions/subcustomer-not-found.exception';
import { CreateLocationInput } from '@customer/domain/inputs/location.input';

describe('CreateLocationUseCase', () => {
  let useCase: CreateLocationUseCase;
  let mockService: jest.Mocked<CreateLocationService>;

  beforeEach(() => {
    mockService = {
      findCustomerById: jest.fn(),
      findSubCustomerById: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<CreateLocationService>;
    useCase = new CreateLocationUseCase(mockService);
  });

  describe('execute', () => {
    it('should create a location successfully', async () => {
      const input: CreateLocationInput = {
        customerId: 'cust-1',
        subCustomerId: null,
        name: 'Main Office',
        address: '123 Main St',
        city: 'Caracas',
      };

      mockService.findCustomerById.mockResolvedValue({ id: 'cust-1' } as never);
      mockService.create.mockResolvedValue({
        id: 'loc-1',
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const result = await useCase.execute(input);

      expect(mockService.findCustomerById).toHaveBeenCalledWith('cust-1');
      expect(mockService.create).toHaveBeenCalledWith(input);
      expect(result.name).toBe('Main Office');
    });

    it('should throw CustomerNotFoundException if customer does not exist', async () => {
      mockService.findCustomerById.mockResolvedValue(null);
      const input: CreateLocationInput = {
        customerId: 'non-existent',
        subCustomerId: null,
        name: 'test',
        address: 'test',
        city: 'test',
      };

      await expect(useCase.execute(input)).rejects.toThrow(CustomerNotFoundException);
    });

    it('should validate subcustomer if provided', async () => {
      const input: CreateLocationInput = {
        customerId: 'cust-1',
        subCustomerId: 'sub-1',
        name: 'Branch',
        address: '456 Branch Ave',
        city: 'Caracas',
      };

      mockService.findCustomerById.mockResolvedValue({ id: 'cust-1' } as never);
      mockService.findSubCustomerById.mockResolvedValue({ id: 'sub-1' } as never);
      mockService.create.mockResolvedValue({ id: 'loc-1' } as never);

      await useCase.execute(input);

      expect(mockService.findSubCustomerById).toHaveBeenCalledWith('sub-1');
    });

    it('should throw SubCustomerNotFoundException if subcustomer does not exist', async () => {
      mockService.findCustomerById.mockResolvedValue({ id: 'cust-1' } as never);
      mockService.findSubCustomerById.mockResolvedValue(null);
      const input: CreateLocationInput = {
        customerId: 'cust-1',
        subCustomerId: 'non-existent',
        name: 'test',
        address: 'test',
        city: 'test',
      };

      await expect(useCase.execute(input)).rejects.toThrow(SubCustomerNotFoundException);
    });
  });
});
