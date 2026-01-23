import { UpdateCustomerUseCase } from '@customer/application/update-customer.use-case';
import { UpdateCustomerService } from '@customer/domain/update-customer.service';
import { CustomerEntity, CustomerState } from '@customer/domain/customer.entity';
import { UpdateCustomerInput } from '@customer/domain/inputs/customer.input';
import { CustomerNotFoundException } from '@customer/domain/exceptions/customer-not-found.exception';
import { CustomerAlreadyExistsException } from '@customer/domain/exceptions/customer-already-exists.exception';

describe('UpdateCustomerUseCase', () => {
  let useCase: UpdateCustomerUseCase;
  let mockService: jest.Mocked<UpdateCustomerService>;

  beforeEach(() => {
    mockService = {
      findById: jest.fn(),
      findByTaxId: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<UpdateCustomerService>;

    useCase = new UpdateCustomerUseCase(mockService);
  });

  describe('execute', () => {
    it('should update a customer successfully', async () => {
      const customerId = '1';
      const input: UpdateCustomerInput = {
        businessName: 'Updated Business',
        legalName: 'Updated Legal',
      };

      const existingCustomer: CustomerEntity = {
        id: customerId,
        code: 'C001',
        businessName: 'Old Business',
        legalName: 'Old Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
        phone: null,
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedCustomer: CustomerEntity = {
        ...existingCustomer,
        businessName: 'Updated Business',
        legalName: 'Updated Legal',
      };

      mockService.findById.mockResolvedValue(existingCustomer);
      mockService.update.mockResolvedValue(updatedCustomer);

      const result = await useCase.execute(customerId, input);

      expect(mockService.findById).toHaveBeenCalledWith(customerId);
      expect(mockService.update).toHaveBeenCalledWith(customerId, input);
      expect(result).toEqual(updatedCustomer);
    });

    it('should throw CustomerNotFoundException when customer does not exist', async () => {
      const customerId = '999';
      const input: UpdateCustomerInput = {
        businessName: 'Updated Business',
      };

      mockService.findById.mockResolvedValue(null);

      await expect(useCase.execute(customerId, input)).rejects.toThrow(CustomerNotFoundException);
      await expect(useCase.execute(customerId, input)).rejects.toThrow(
        "Customer with ID '999' not found"
      );

      expect(mockService.findById).toHaveBeenCalledWith(customerId);
      expect(mockService.findByTaxId).not.toHaveBeenCalled();
      expect(mockService.update).not.toHaveBeenCalled();
    });

    it('should update taxId when it is unique', async () => {
      const customerId = '1';
      const input: UpdateCustomerInput = {
        taxId: 'J-99999999-9',
      };

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

      const updatedCustomer: CustomerEntity = {
        ...existingCustomer,
        taxId: 'J-99999999-9',
      };

      mockService.findById.mockResolvedValue(existingCustomer);
      mockService.findByTaxId.mockResolvedValue(null);
      mockService.update.mockResolvedValue(updatedCustomer);

      const result = await useCase.execute(customerId, input);

      expect(mockService.findById).toHaveBeenCalledWith(customerId);
      expect(mockService.findByTaxId).toHaveBeenCalledWith('J-99999999-9');
      expect(mockService.update).toHaveBeenCalledWith(customerId, input);
      expect(result).toEqual(updatedCustomer);
    });

    it('should throw CustomerAlreadyExistsException when new taxId belongs to another customer', async () => {
      const customerId = '1';
      const input: UpdateCustomerInput = {
        taxId: 'J-99999999-9',
      };

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

      const otherCustomer: CustomerEntity = {
        id: '2',
        code: 'C002',
        businessName: 'Other Business',
        legalName: 'Other Legal',
        taxId: 'J-99999999-9',
        address: 'Other Address',
        phone: null,
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.findById.mockResolvedValue(existingCustomer);
      mockService.findByTaxId.mockResolvedValue(otherCustomer);

      await expect(useCase.execute(customerId, input)).rejects.toThrow(
        CustomerAlreadyExistsException
      );
      await expect(useCase.execute(customerId, input)).rejects.toThrow(
        "Customer with taxId 'J-99999999-9' already exists"
      );

      expect(mockService.findById).toHaveBeenCalledWith(customerId);
      expect(mockService.findByTaxId).toHaveBeenCalledWith('J-99999999-9');
      expect(mockService.update).not.toHaveBeenCalled();
    });

    it('should not check taxId uniqueness when taxId is not being updated', async () => {
      const customerId = '1';
      const input: UpdateCustomerInput = {
        businessName: 'Updated Business',
      };

      const existingCustomer: CustomerEntity = {
        id: customerId,
        code: 'C001',
        businessName: 'Old Business',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
        phone: null,
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedCustomer: CustomerEntity = {
        ...existingCustomer,
        businessName: 'Updated Business',
      };

      mockService.findById.mockResolvedValue(existingCustomer);
      mockService.update.mockResolvedValue(updatedCustomer);

      const result = await useCase.execute(customerId, input);

      expect(mockService.findById).toHaveBeenCalledWith(customerId);
      expect(mockService.findByTaxId).not.toHaveBeenCalled();
      expect(mockService.update).toHaveBeenCalledWith(customerId, input);
      expect(result).toEqual(updatedCustomer);
    });

    it('should not check taxId uniqueness when taxId is the same', async () => {
      const customerId = '1';
      const input: UpdateCustomerInput = {
        taxId: 'J-12345678-9', // Same as existing
        businessName: 'Updated Business',
      };

      const existingCustomer: CustomerEntity = {
        id: customerId,
        code: 'C001',
        businessName: 'Old Business',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
        phone: null,
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedCustomer: CustomerEntity = {
        ...existingCustomer,
        businessName: 'Updated Business',
      };

      mockService.findById.mockResolvedValue(existingCustomer);
      mockService.update.mockResolvedValue(updatedCustomer);

      const result = await useCase.execute(customerId, input);

      expect(mockService.findById).toHaveBeenCalledWith(customerId);
      expect(mockService.findByTaxId).not.toHaveBeenCalled();
      expect(mockService.update).toHaveBeenCalledWith(customerId, input);
      expect(result).toEqual(updatedCustomer);
    });
  });
});
