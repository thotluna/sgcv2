import { CreateSubCustomerUseCase } from '@customer/application/create-subcustomer.use-case';
import { CreateSubCustomerService } from '@customer/domain/create-subcustomer.service';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { SubCustomerAlreadyExistsException } from '@customer/domain/exceptions/subcustomer-already-exists.exception';
import { CreateSubCustomerInput } from '@customer/domain/inputs/subcustomer.input';

describe('CreateSubCustomerUseCase', () => {
  let useCase: CreateSubCustomerUseCase;
  let mockService: jest.Mocked<CreateSubCustomerService>;

  beforeEach(() => {
    mockService = {
      findCustomerById: jest.fn(),
      findByExternalCode: jest.fn(),
      create: jest.fn(),
    } as any;
    useCase = new CreateSubCustomerUseCase(mockService);
  });

  describe('execute', () => {
    it('should create a subcustomer successfully', async () => {
      const input: CreateSubCustomerInput = {
        customerId: 'cust-1',
        businessName: 'Sub 1',
        externalCode: 'EXT-001',
      };

      mockService.findCustomerById.mockResolvedValue({ id: 'cust-1' } as any);
      mockService.findByExternalCode.mockResolvedValue(null);
      mockService.create.mockResolvedValue({
        id: 'sub-1',
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await useCase.execute(input);

      expect(mockService.findCustomerById).toHaveBeenCalledWith('cust-1');
      expect(mockService.findByExternalCode).toHaveBeenCalledWith('cust-1', 'EXT-001');
      expect(mockService.create).toHaveBeenCalledWith(input);
      expect(result.businessName).toBe('Sub 1');
    });

    it('should throw CustomerNotFoundException if customer does not exist', async () => {
      mockService.findCustomerById.mockResolvedValue(null);
      const input: CreateSubCustomerInput = {
        customerId: 'non-existent',
        businessName: 'test',
        externalCode: 'test',
      };

      await expect(useCase.execute(input)).rejects.toThrow(CustomerNotFoundException);
    });

    it('should throw SubCustomerAlreadyExistsException if externalCode exists for customer', async () => {
      mockService.findCustomerById.mockResolvedValue({ id: 'cust-1' } as any);
      mockService.findByExternalCode.mockResolvedValue({ id: 'old-sub' } as any);
      const input: CreateSubCustomerInput = {
        customerId: 'cust-1',
        businessName: 'test',
        externalCode: 'EXT-001',
      };

      await expect(useCase.execute(input)).rejects.toThrow(SubCustomerAlreadyExistsException);
    });
  });
});
