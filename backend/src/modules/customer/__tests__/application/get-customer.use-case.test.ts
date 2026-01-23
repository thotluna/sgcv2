import { GetCustomerUseCase } from '../../application/get-customer.use-case';
import { GetCustomerService } from '../../domain/get-customer.service';
import { CustomerEntity, CustomerState } from '../../domain/customer.entity';
import { CustomerNotFoundException } from '../../domain/exceptions/customer-not-found.exception';

describe('GetCustomerUseCase', () => {
  let useCase: GetCustomerUseCase;
  let mockService: jest.Mocked<GetCustomerService>;

  beforeEach(() => {
    mockService = {
      findById: jest.fn(),
    } as jest.Mocked<GetCustomerService>;

    useCase = new GetCustomerUseCase(mockService);
  });

  describe('execute', () => {
    it('should return a customer when found', async () => {
      const customerId = '1';
      const mockCustomer: CustomerEntity = {
        id: customerId,
        code: 'C001',
        businessName: 'Test Business',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
        phone: '1234567890',
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.findById.mockResolvedValue(mockCustomer);

      const result = await useCase.execute(customerId);

      expect(mockService.findById).toHaveBeenCalledWith(customerId);
      expect(result).toEqual(mockCustomer);
    });

    it('should throw CustomerNotFoundException when customer does not exist', async () => {
      const customerId = '999';

      mockService.findById.mockResolvedValue(null);

      await expect(useCase.execute(customerId)).rejects.toThrow(CustomerNotFoundException);
      await expect(useCase.execute(customerId)).rejects.toThrow("Customer with ID '999' not found");

      expect(mockService.findById).toHaveBeenCalledWith(customerId);
    });
  });
});
