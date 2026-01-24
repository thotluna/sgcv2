import { prisma } from '@config/prisma';
import { LocationPrismaRepository } from '@customer/infrastructure/persist/location-prisma.repository';

jest.mock('@config/prisma', () => ({
  prisma: {
    customerLocation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const mockPrismaLocation = prisma.customerLocation as jest.Mocked<typeof prisma.customerLocation>;

describe('LocationPrismaRepository', () => {
  let repository: LocationPrismaRepository;

  beforeEach(() => {
    repository = new LocationPrismaRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a location with inclusion', async () => {
      const input = {
        customerId: 'c1',
        subCustomerId: null,
        name: 'Office',
        address: '123 Main St',
      };
      mockPrismaLocation.create.mockResolvedValue({
        id: '1',
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await repository.create(input);

      expect(mockPrismaLocation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            customerId: 'c1',
            name: 'Office',
          }),
        })
      );
      expect(result.id).toBe('1');
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      mockPrismaLocation.findMany.mockResolvedValue([]);
      mockPrismaLocation.count.mockResolvedValue(0);

      const result = await repository.findAll({ page: 1, limit: 10 });

      expect(mockPrismaLocation.findMany).toHaveBeenCalled();
      expect(result.total).toBe(0);
    });

    it('should apply filters correctly', async () => {
      mockPrismaLocation.findMany.mockResolvedValue([]);
      mockPrismaLocation.count.mockResolvedValue(0);

      await repository.findAll({ page: 1, limit: 10, search: 'test' }, 'cust-1');

      expect(mockPrismaLocation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            customerId: 'cust-1',
            OR: expect.any(Array),
          }),
        })
      );
    });
  });

  describe('findById', () => {
    it('should return location if found', async () => {
      mockPrismaLocation.findUnique.mockResolvedValue({ id: '1' } as any);
      const result = await repository.findById('1');
      expect(result?.id).toBe('1');
    });

    it('should return null if not found', async () => {
      mockPrismaLocation.findUnique.mockResolvedValue(null);
      const result = await repository.findById('none');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update location', async () => {
      mockPrismaLocation.update.mockResolvedValue({ id: '1', name: 'New' } as any);
      const result = await repository.update('1', { name: 'New' });
      expect(result.name).toBe('New');
    });
  });

  describe('delete', () => {
    it('should delete location', async () => {
      mockPrismaLocation.delete.mockResolvedValue({ id: '1' } as any);
      const result = await repository.delete('1');
      expect(result.id).toBe('1');
    });
  });
});
