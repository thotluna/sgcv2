import { CreateCustomerUseCase } from '@customer/application/create-customer.use-case';
import { CreateCustomerService } from '@customer/domain/create-customer.service';
import { CustomerEntity, CustomerState } from '@customer/domain/customer.entity';
import { CustomerAlreadyExistsException } from '@customer/domain/exceptions/customer-already-exists.exception';
import { CreateCustomerInput } from '@customer/domain/inputs/customer.input';

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
  let mockService: jest.Mocked<CreateCustomerService>;

  beforeEach(() => {
    mockService = {
      findByCode: jest.fn(),
      findByTaxId: jest.fn(),
      create: jest.fn(),
    } as jest.Mocked<CreateCustomerService>;

    useCase = new CreateCustomerUseCase(mockService);
  });

  describe('execute', () => {
    it('should create a customer when code and taxId are unique', async () => {
      const input: CreateCustomerInput = {
        code: 'C001',
        businessName: 'Test Business',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
        phone: '1234567890',
      };

      const mockCustomer: CustomerEntity = {
        id: '1',
        ...input,
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.findByCode.mockResolvedValue(null);
      mockService.findByTaxId.mockResolvedValue(null);
      mockService.create.mockResolvedValue(mockCustomer);

      const result = await useCase.execute(input);

      expect(mockService.findByCode).toHaveBeenCalledWith('C001');
      expect(mockService.findByTaxId).toHaveBeenCalledWith('J-12345678-9');
      expect(mockService.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockCustomer);
    });

    it('should throw CustomerAlreadyExistsException when code exists', async () => {
      const input: CreateCustomerInput = {
        code: 'C001',
        businessName: 'Test Business',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
      };

      const existingCustomer: CustomerEntity = {
        id: '2',
        ...input,
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.findByCode.mockResolvedValue(existingCustomer);

      await expect(useCase.execute(input)).rejects.toThrow(CustomerAlreadyExistsException);
      await expect(useCase.execute(input)).rejects.toThrow(
        "Customer with code 'C001' already exists"
      );

      expect(mockService.findByCode).toHaveBeenCalledWith('C001');
      expect(mockService.findByTaxId).not.toHaveBeenCalled();
      expect(mockService.create).not.toHaveBeenCalled();
    });

    it('should throw CustomerAlreadyExistsException when taxId exists', async () => {
      const input: CreateCustomerInput = {
        code: 'C001',
        businessName: 'Test Business',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
      };

      const existingCustomer: CustomerEntity = {
        id: '2',
        code: 'C002',
        businessName: 'Other Business',
        legalName: 'Other Legal',
        taxId: 'J-12345678-9',
        address: 'Other Address',
        phone: null,
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.findByCode.mockResolvedValue(null);
      mockService.findByTaxId.mockResolvedValue(existingCustomer);

      await expect(useCase.execute(input)).rejects.toThrow(CustomerAlreadyExistsException);
      await expect(useCase.execute(input)).rejects.toThrow(
        "Customer with taxId 'J-12345678-9' already exists"
      );

      expect(mockService.findByCode).toHaveBeenCalledWith('C001');
      expect(mockService.findByTaxId).toHaveBeenCalledWith('J-12345678-9');
      expect(mockService.create).not.toHaveBeenCalled();
    });
  });
});
