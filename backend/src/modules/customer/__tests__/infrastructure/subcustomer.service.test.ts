import { SubCustomerService } from '@customer/infrastructure/http/subcustomer.service';
import { SubCustomerRepository } from '@customer/domain/subcustomer.repository';
import { CustomerRepository } from '@customer/domain/customer.repository';
import { SubCustomerEntity } from '@customer/domain/subcustomer.entity';
import { CustomerEntity, CustomerState } from '@customer/domain/customer.entity';
import {
  CreateSubCustomerInput,
  UpdateSubCustomerInput,
  SubCustomerFilterInput,
} from '@customer/domain/inputs/subcustomer.input';

describe('SubCustomerService', () => {
  let service: SubCustomerService;
  let mockSubRepo: jest.Mocked<SubCustomerRepository>;
  let mockCustRepo: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    mockSubRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByExternalCode: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockCustRepo = {
      findById: jest.fn(),
    } as any;

    service = new SubCustomerService(mockSubRepo, mockCustRepo);
  });

  describe('findByExternalCode', () => {
    it('should delegate to subCustomerRepository', async () => {
      const mockSub: SubCustomerEntity = {
        id: '1',
        customerId: 'cust-1',
        businessName: 'Sub 1',
        externalCode: 'EXT-001',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockSubRepo.findByExternalCode.mockResolvedValue(mockSub);

      const result = await service.findByExternalCode('cust-1', 'EXT-001');

      expect(mockSubRepo.findByExternalCode).toHaveBeenCalledWith('cust-1', 'EXT-001');
      expect(result).toEqual(mockSub);
    });
  });

  describe('create', () => {
    it('should delegate to subCustomerRepository', async () => {
      const input: CreateSubCustomerInput = {
        customerId: 'cust-1',
        businessName: 'New Sub',
        externalCode: 'EXT-002',
      };
      const mockSub: SubCustomerEntity = {
        id: '2',
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockSubRepo.create.mockResolvedValue(mockSub);

      const result = await service.create(input);

      expect(mockSubRepo.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockSub);
    });
  });

  describe('findAll', () => {
    it('should delegate to subCustomerRepository with customerId', async () => {
      const filters: SubCustomerFilterInput = { page: 1, limit: 10 };
      const mockResult = { items: [], total: 0 };
      mockSubRepo.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll(filters, 'cust-1');

      expect(mockSubRepo.findAll).toHaveBeenCalledWith(filters, 'cust-1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('findById', () => {
    it('should delegate to subCustomerRepository', async () => {
      const mockSub: SubCustomerEntity = {
        id: '1',
        customerId: 'cust-1',
        businessName: 'Sub 1',
        externalCode: 'EXT-001',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockSubRepo.findById.mockResolvedValue(mockSub);

      const result = await service.findById('1');

      expect(mockSubRepo.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockSub);
    });
  });

  describe('findCustomerById', () => {
    it('should delegate to customerRepository', async () => {
      const mockCust: CustomerEntity = {
        id: 'cust-1',
        code: 'C001',
        businessName: 'Main Cust',
        legalName: 'Legal Main',
        taxId: 'J-123',
        address: 'Addr',
        phone: null,
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockCustRepo.findById.mockResolvedValue(mockCust);

      const result = await service.findCustomerById('cust-1');

      expect(mockCustRepo.findById).toHaveBeenCalledWith('cust-1');
      expect(result).toEqual(mockCust);
    });
  });

  describe('update', () => {
    it('should delegate to subCustomerRepository', async () => {
      const input: UpdateSubCustomerInput = { businessName: 'Updated Sub' };
      const mockSub: SubCustomerEntity = {
        id: '1',
        customerId: 'cust-1',
        businessName: 'Updated Sub',
        externalCode: 'EXT-001',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockSubRepo.update.mockResolvedValue(mockSub);

      const result = await service.update('1', input);

      expect(mockSubRepo.update).toHaveBeenCalledWith('1', input);
      expect(result).toEqual(mockSub);
    });
  });

  describe('delete', () => {
    it('should delegate to subCustomerRepository', async () => {
      const mockSub: SubCustomerEntity = {
        id: '1',
        customerId: 'cust-1',
        businessName: 'Sub 1',
        externalCode: 'EXT-001',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockSubRepo.delete.mockResolvedValue(mockSub);

      const result = await service.delete('1');

      expect(mockSubRepo.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockSub);
    });
  });
});
