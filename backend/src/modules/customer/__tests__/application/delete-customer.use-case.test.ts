import { DeleteCustomerUseCase } from '@customer/application/delete-customer.use-case';
import { DeleteCustomerService } from '@customer/domain/delete-customer.service';
import { CustomerEntity, CustomerState } from '@customer/domain/customer.entity';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';

describe('DeleteCustomerUseCase', () => {
  let useCase: DeleteCustomerUseCase;
  let mockService: jest.Mocked<DeleteCustomerService>;

  beforeEach(() => {
    mockService = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<DeleteCustomerService>;

    useCase = new DeleteCustomerUseCase(mockService);
  });

  describe('execute', () => {
    it('should delete a customer successfully', async () => {
      const customerId = '1';
      const existingCustomer: CustomerEntity = {
        id: customerId,
        code: 'C001',
        businessName: 'Test Business',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
        phone: null,
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const deletedCustomer: CustomerEntity = {
        ...existingCustomer,
        state: CustomerState.INACTIVE,
      };

      mockService.findById.mockResolvedValue(existingCustomer);
      mockService.delete.mockResolvedValue(deletedCustomer);

      const result = await useCase.execute(customerId);

      expect(mockService.findById).toHaveBeenCalledWith(customerId);
      expect(mockService.delete).toHaveBeenCalledWith(customerId);
      expect(result).toEqual(deletedCustomer);
      expect(result.state).toBe(CustomerState.INACTIVE);
    });

    it('should throw CustomerNotFoundException when customer does not exist', async () => {
      const customerId = '999';

      mockService.findById.mockResolvedValue(null);

      await expect(useCase.execute(customerId)).rejects.toThrow(CustomerNotFoundException);
      await expect(useCase.execute(customerId)).rejects.toThrow("Customer with ID '999' not found");

      expect(mockService.findById).toHaveBeenCalledWith(customerId);
      expect(mockService.delete).not.toHaveBeenCalled();
    });
  });
});
