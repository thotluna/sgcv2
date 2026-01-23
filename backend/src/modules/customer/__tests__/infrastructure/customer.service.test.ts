import { CustomerService } from '../../infrastructure/http/customer.service';
import { CustomerRepository } from '../../domain/customer.repository';
import { CustomerEntity, CustomerState } from '../../domain/customer.entity';
import { CreateCustomerInput, UpdateCustomerInput } from '../../domain/inputs/customer.input';

describe('CustomerService', () => {
  let customerService: CustomerService;
  let mockRepository: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findByTaxId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<CustomerRepository>;

    customerService = new CustomerService(mockRepository);
  });

  describe('findByCode', () => {
    it('should delegate to repository', async () => {
      const mockCustomer: CustomerEntity = {
        id: '1',
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

      mockRepository.findByCode.mockResolvedValue(mockCustomer);

      const result = await customerService.findByCode('C001');

      expect(mockRepository.findByCode).toHaveBeenCalledWith('C001');
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('create', () => {
    it('should delegate to repository', async () => {
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

      mockRepository.create.mockResolvedValue(mockCustomer);

      const result = await customerService.create(input);

      expect(mockRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('findAll', () => {
    it('should delegate to repository with filters', async () => {
      const filters = { page: 1, limit: 10, state: CustomerState.ACTIVE, search: 'test' };
      const mockResult = { items: [], total: 0 };

      mockRepository.findAll.mockResolvedValue(mockResult);

      const result = await customerService.findAll(filters);

      expect(mockRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findById', () => {
    it('should delegate to repository', async () => {
      const mockCustomer: CustomerEntity = {
        id: '1',
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

      mockRepository.findById.mockResolvedValue(mockCustomer);

      const result = await customerService.findById('1');

      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('findByTaxId', () => {
    it('should delegate to repository', async () => {
      const mockCustomer: CustomerEntity = {
        id: '1',
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

      mockRepository.findByTaxId.mockResolvedValue(mockCustomer);

      const result = await customerService.findByTaxId('J-12345678-9');

      expect(mockRepository.findByTaxId).toHaveBeenCalledWith('J-12345678-9');
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('update', () => {
    it('should delegate to repository', async () => {
      const input: UpdateCustomerInput = {
        businessName: 'Updated Business',
      };

      const mockCustomer: CustomerEntity = {
        id: '1',
        code: 'C001',
        businessName: 'Updated Business',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
        phone: null,
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.update.mockResolvedValue(mockCustomer);

      const result = await customerService.update('1', input);

      expect(mockRepository.update).toHaveBeenCalledWith('1', input);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('delete', () => {
    it('should delegate to repository', async () => {
      const mockCustomer: CustomerEntity = {
        id: '1',
        code: 'C001',
        businessName: 'Test Business',
        legalName: 'Test Legal',
        taxId: 'J-12345678-9',
        address: 'Test Address',
        phone: null,
        state: CustomerState.INACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.delete.mockResolvedValue(mockCustomer);

      const result = await customerService.delete('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockCustomer);
    });
  });
});
