import { LocationService } from '@customer/infrastructure/http/location.service';
import { LocationRepository } from '@customer/domain/location.repository';
import { CustomerRepository } from '@customer/domain/customer.repository';
import { SubCustomerRepository } from '@customer/domain/subcustomer.repository';
import { CustomerLocationEntity } from '@customer/domain/location.entity';

describe('LocationService', () => {
  let service: LocationService;
  let mockLocationRepo: jest.Mocked<LocationRepository>;
  let mockCustomerRepo: jest.Mocked<CustomerRepository>;
  let mockSubCustomerRepo: jest.Mocked<SubCustomerRepository>;

  beforeEach(() => {
    mockLocationRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockCustomerRepo = {
      findById: jest.fn(),
    } as any;

    mockSubCustomerRepo = {
      findById: jest.fn(),
    } as any;

    service = new LocationService(mockLocationRepo, mockCustomerRepo, mockSubCustomerRepo);
  });

  describe('create', () => {
    it('should delegate to locationRepository', async () => {
      const input = { customerId: 'c1', subCustomerId: null, name: 'Office', address: 'Addr' };
      const mockLocation: CustomerLocationEntity = {
        id: '1',
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockLocationRepo.create.mockResolvedValue(mockLocation);

      const result = await service.create(input);

      expect(mockLocationRepo.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockLocation);
    });
  });

  describe('findAll', () => {
    it('should delegate to locationRepository with filters', async () => {
      const filters = { page: 1, limit: 10 };
      const mockResult = { items: [], total: 0 };
      mockLocationRepo.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll(filters, 'cust-1');

      expect(mockLocationRepo.findAll).toHaveBeenCalledWith(filters, 'cust-1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('findById', () => {
    it('should delegate to locationRepository', async () => {
      const mockLocation: CustomerLocationEntity = {
        id: '1',
        customerId: 'c1',
        subCustomerId: null,
        name: 'Office',
        address: 'Addr',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockLocationRepo.findById.mockResolvedValue(mockLocation);

      const result = await service.findById('1');

      expect(mockLocationRepo.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockLocation);
    });
  });

  describe('update', () => {
    it('should delegate to locationRepository', async () => {
      const input = { name: 'Updated Office' };
      const mockLocation: CustomerLocationEntity = {
        id: '1',
        customerId: 'c1',
        subCustomerId: null,
        name: 'Updated Office',
        address: 'Addr',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockLocationRepo.update.mockResolvedValue(mockLocation);

      const result = await service.update('1', input);

      expect(mockLocationRepo.update).toHaveBeenCalledWith('1', input);
      expect(result).toEqual(mockLocation);
    });
  });

  describe('delete', () => {
    it('should delegate to locationRepository', async () => {
      const mockLocation: CustomerLocationEntity = {
        id: '1',
        customerId: 'c1',
        subCustomerId: null,
        name: 'Office',
        address: 'Addr',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockLocationRepo.delete.mockResolvedValue(mockLocation);

      const result = await service.delete('1');

      expect(mockLocationRepo.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockLocation);
    });
  });

  describe('findCustomerById', () => {
    it('should delegate to customerRepository', async () => {
      mockCustomerRepo.findById.mockResolvedValue({ id: 'c1' } as any);

      const result = await service.findCustomerById('c1');

      expect(mockCustomerRepo.findById).toHaveBeenCalledWith('c1');
      expect(result?.id).toBe('c1');
    });
  });

  describe('findSubCustomerById', () => {
    it('should delegate to subCustomerRepository', async () => {
      mockSubCustomerRepo.findById.mockResolvedValue({ id: 's1' } as any);

      const result = await service.findSubCustomerById('s1');

      expect(mockSubCustomerRepo.findById).toHaveBeenCalledWith('s1');
      expect(result?.id).toBe('s1');
    });
  });
});
