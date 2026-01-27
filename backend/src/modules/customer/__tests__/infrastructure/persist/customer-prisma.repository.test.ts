import { prisma } from '@config/prisma';
import { CustomerState } from '@customer/domain/customer.entity';
import { CustomerPrismaRepository } from '@customer/infrastructure/persist/customer-prisma.repository';

jest.mock('@config/prisma', () => ({
  prisma: {
    customer: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const mockPrismaCustomer = prisma.customer as jest.Mocked<typeof prisma.customer>;

describe('CustomerPrismaRepository', () => {
  let repository: CustomerPrismaRepository;

  beforeEach(() => {
    repository = new CustomerPrismaRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a customer successfully', async () => {
      const input = {
        code: 'C001',
        legalName: 'Legal',
        taxId: 'T-123',
        address: 'Addr',
        businessName: 'Business',
        phone: '123',
      };
      const mockResult = {
        id: '1',
        ...input,
        state: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaCustomer.create.mockResolvedValue(mockResult as any);

      const result = await repository.create(input);

      expect(mockPrismaCustomer.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          code: 'C001',
          state: 'ACTIVE',
        }),
      });
      expect(result.id).toBe('1');
      expect(result.state).toBe(CustomerState.ACTIVE);
    });
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      mockPrismaCustomer.findMany.mockResolvedValue([]);
      mockPrismaCustomer.count.mockResolvedValue(0);

      const result = await repository.findAll({ page: 1, limit: 10 });

      expect(mockPrismaCustomer.findMany).toHaveBeenCalled();
      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should apply filters correctly', async () => {
      mockPrismaCustomer.findMany.mockResolvedValue([]);
      mockPrismaCustomer.count.mockResolvedValue(0);

      await repository.findAll({ search: 'test', state: CustomerState.ACTIVE });

      expect(mockPrismaCustomer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            state: 'ACTIVE',
            OR: expect.any(Array),
          }),
        })
      );
    });
  });

  describe('findById', () => {
    it('should return customer if found', async () => {
      mockPrismaCustomer.findUnique.mockResolvedValue({ id: '1' } as any);
      const result = await repository.findById('1');
      expect(result?.id).toBe('1');
    });

    it('should return null if not found', async () => {
      mockPrismaCustomer.findUnique.mockResolvedValue(null);
      const result = await repository.findById('none');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update customer data', async () => {
      mockPrismaCustomer.update.mockResolvedValue({ id: '1', businessName: 'New' } as any);
      const result = await repository.update('1', { businessName: 'New' });
      expect(result.businessName).toBe('New');
    });
  });

  describe('delete', () => {
    it('should set state to INACTIVE', async () => {
      mockPrismaCustomer.update.mockResolvedValue({ id: '1', state: 'INACTIVE' } as any);
      const result = await repository.delete('1');
      expect(result.state).toBe(CustomerState.INACTIVE);
      expect(mockPrismaCustomer.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { state: 'INACTIVE' },
      });
    });
  });
});
