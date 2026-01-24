import { prisma } from '@config/prisma';
import { SubCustomerPrismaRepository } from '@customer/infrastructure/persist/subcustomer-prisma.repository';

jest.mock('@config/prisma', () => ({
  prisma: {
    subCustomer: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const mockPrismaSubCustomer = prisma.subCustomer as jest.Mocked<typeof prisma.subCustomer>;

describe('SubCustomerPrismaRepository', () => {
  let repository: SubCustomerPrismaRepository;

  beforeEach(() => {
    repository = new SubCustomerPrismaRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a subcustomer with inclusion', async () => {
      const input = { customerId: 'c1', businessName: 'S1', externalCode: 'E1' };
      mockPrismaSubCustomer.create.mockResolvedValue({
        id: '1',
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
        customer: { legalName: 'L', businessName: 'B' },
      } as any);

      const result = await repository.create(input);

      expect(mockPrismaSubCustomer.create).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { customer: true },
        })
      );
      expect(result.id).toBe('1');
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      mockPrismaSubCustomer.findMany.mockResolvedValue([]);
      mockPrismaSubCustomer.count.mockResolvedValue(0);

      const result = await repository.findAll({ page: 1, limit: 10 });

      expect(mockPrismaSubCustomer.findMany).toHaveBeenCalled();
      expect(result.total).toBe(0);
    });
  });

  describe('findById', () => {
    it('should return subcustomer if found', async () => {
      mockPrismaSubCustomer.findUnique.mockResolvedValue({ id: '1' } as any);
      const result = await repository.findById('1');
      expect(result?.id).toBe('1');
    });
  });

  describe('findByExternalCode', () => {
    it('should use composite unique key', async () => {
      mockPrismaSubCustomer.findUnique.mockResolvedValue({ id: '1' } as any);

      await repository.findByExternalCode('c1', 'e1');

      expect(mockPrismaSubCustomer.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            customerId_externalCode: {
              customerId: 'c1',
              externalCode: 'e1',
            },
          },
        })
      );
    });
  });

  describe('update', () => {
    it('should update subcustomer', async () => {
      mockPrismaSubCustomer.update.mockResolvedValue({ id: '1', businessName: 'New' } as any);
      const result = await repository.update('1', { businessName: 'New' });
      expect(result.businessName).toBe('New');
    });
  });

  describe('delete', () => {
    it('should delete subcustomer', async () => {
      mockPrismaSubCustomer.delete.mockResolvedValue({ id: '1' } as any);
      const result = await repository.delete('1');
      expect(result.id).toBe('1');
    });
  });
});
