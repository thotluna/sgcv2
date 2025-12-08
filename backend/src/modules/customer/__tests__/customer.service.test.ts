import { CustomerServiceImp } from '../customer.service';
import { prisma } from '../../../config/prisma';
import { UpdateCustomerDto } from '@sgcv2/shared';

jest.mock('../../../config/prisma', () => ({
  prisma: {
    customer: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('CustomerService', () => {
  let service: CustomerServiceImp;

  beforeEach(() => {
    service = new CustomerServiceImp();
    jest.resetAllMocks();
  });

  describe('create', () => {
    const createDto = {
      code: 'C001',
      businessName: 'Test Business',
      legalName: 'Test Legal',
      taxId: '123456789',
      address: 'Test Address',
      phone: '1234567890',
    };

    it('should create a new customer successfully', async () => {
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.customer.create as jest.Mock).mockResolvedValue({
        id: 'uuid',
        ...createDto,
        state: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(createDto);

      expect(result).toHaveProperty('id');
      expect(result.code).toBe(createDto.code);
      expect(prisma.customer.create).toHaveBeenCalled();
    });

    it('should throw error if customer code already exists', async () => {
      (prisma.customer.findUnique as jest.Mock)
        .mockResolvedValueOnce({ id: 'existing' }) // First call for code check
        .mockResolvedValueOnce(null); // Second call for taxId check (won't be reached)

      await expect(service.create(createDto)).rejects.toThrow('Customer code already exists');
    });

    it('should throw error if customer taxId already exists', async () => {
      (prisma.customer.findUnique as jest.Mock)
        .mockResolvedValueOnce(null) // First call for code check
        .mockResolvedValueOnce({ id: 'existing' }); // Second call for taxId check

      await expect(service.create(createDto)).rejects.toThrow('Customer tax id already exists');
    });
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      const customers = [{ id: '1', businessName: 'Customer 1' }];
      const total = 1;

      (prisma.customer.findMany as jest.Mock).mockResolvedValue(customers);
      (prisma.customer.count as jest.Mock).mockResolvedValue(total);

      const result = await service.findAll(1, 10);

      expect(result.customers).toEqual(customers);
      expect(result.pagination.total).toBe(total);
      expect(prisma.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        })
      );
    });

    it('should filter by state', async () => {
      const customers = [{ id: '1', state: 'ACTIVE' }];
      const total = 1;

      (prisma.customer.findMany as jest.Mock).mockResolvedValue(customers);
      (prisma.customer.count as jest.Mock).mockResolvedValue(total);

      await service.findAll(1, 10, { state: 'ACTIVE' });

      expect(prisma.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { state: 'ACTIVE' },
        })
      );
    });
  });

  describe('findById', () => {
    it('should return a customer if found', async () => {
      const customer = { id: '1', businessName: 'Test' };
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(customer);

      const result = await service.findById('1');
      expect(result).toEqual(customer);
    });

    it('should throw error if customer not found', async () => {
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findById('1')).rejects.toThrow('Customer not found');
    });
  });

  describe('findByCode', () => {
    it('should return a customer if found', async () => {
      const customer = { id: '1', code: 'C001' };
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(customer);

      const result = await service.findByCode('C001');
      expect(result).toEqual(customer);
    });

    it('should throw error if customer not found', async () => {
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findByCode('C001')).rejects.toThrow('Customer not found');
    });
  });

  describe('update', () => {
    const updateDto: UpdateCustomerDto = {
      code: 'C001',
      businessName: 'Updated Name',
      legalName: 'Updated Legal Name',
      taxId: 'Updated Tax ID',
      address: 'Updated Address',
      phone: 'Updated Phone',
    };

    it('should update a customer successfully', async () => {
      const existingCustomer = { id: '1', businessName: 'Old Name' };
      const updatedCustomer = { ...existingCustomer, ...updateDto };

      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(existingCustomer);
      (prisma.customer.update as jest.Mock).mockResolvedValue(updatedCustomer);

      const result = await service.update('1', updateDto);
      expect(result).toEqual(updatedCustomer);
    });

    it('should throw error if customer to update not found', async () => {
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.update('1', updateDto)).rejects.toThrow('Customer not found');
    });
  });

  describe('delete', () => {
    it('should soft delete a customer successfully', async () => {
      const existingCustomer = { id: '1', state: 'ACTIVE' };
      const deletedCustomer = { id: '1', state: 'INACTIVE' };

      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(existingCustomer);
      (prisma.customer.update as jest.Mock).mockResolvedValue(deletedCustomer);

      const result = await service.delete('1');
      expect(result).toEqual(deletedCustomer);
      expect(prisma.customer.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ state: 'INACTIVE' }),
        })
      );
    });

    it('should throw error if customer to delete not found', async () => {
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.delete('1')).rejects.toThrow('Customer not found');
    });
  });
});
