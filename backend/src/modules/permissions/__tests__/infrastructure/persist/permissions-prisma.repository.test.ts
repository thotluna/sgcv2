import { prisma } from '@config/prisma';
import { PermissionsPrismaRepository } from '@permissions/infrastructure/persist/permissions-prisma.repository';

jest.mock('@config/prisma', () => ({
  prisma: {
    permission: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const mockPrismaPermission = prisma.permission as jest.Mocked<typeof prisma.permission>;

describe('PermissionsPrismaRepository', () => {
  let repository: PermissionsPrismaRepository;

  beforeEach(() => {
    repository = new PermissionsPrismaRepository();
    jest.resetAllMocks();
  });

  describe('getAll', () => {
    it('should return all permissions', async () => {
      const mockPermissions = [
        {
          id: 1,
          resource: 'res1',
          action: 'act1',
          description: 'desc1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          resource: 'res2',
          action: 'act2',
          description: 'desc2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPrismaPermission.findMany.mockResolvedValue(mockPermissions);

      const result = await repository.getAll();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].resource).toBe('res2');
    });
  });

  describe('findById', () => {
    it('should return a permission by id', async () => {
      const mockPermission = {
        id: 1,
        resource: 'res1',
        action: 'act1',
        description: 'desc1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaPermission.findUnique.mockResolvedValue(mockPermission);

      const result = await repository.findById(1);

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
    });

    it('should return null if not found', async () => {
      mockPrismaPermission.findUnique.mockResolvedValue(null);
      const result = await repository.findById(999);
      expect(result).toBeNull();
    });
  });
});
