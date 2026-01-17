import { prisma } from '@config/prisma';
import { RolesPrismaRepository } from '@roles/infrastructure/persist/roles-prisma.repository';
import { RoleWithPermissionsModel } from '@roles/infrastructure/persist/include';

jest.mock('@config/prisma', () => ({
  prisma: {
    role: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
    userRole: {
      count: jest.fn(),
    },
  },
}));

const mockPrismaRole = prisma.role as jest.Mocked<typeof prisma.role>;
const mockPrismaUserRole = prisma.userRole as jest.Mocked<typeof prisma.userRole>;

describe('RolesPrismaRepository', () => {
  let repository: RolesPrismaRepository;

  beforeEach(() => {
    repository = new RolesPrismaRepository();
    jest.resetAllMocks();
  });

  describe('findByIdWithPermissions', () => {
    it('should return a role with permissions', async () => {
      const mockModel: RoleWithPermissionsModel = {
        id: 1,
        name: 'Admin',
        description: 'Admin role',
        createdAt: new Date(),
        updatedAt: new Date(),
        permissions: [
          {
            roleId: 1,
            permissionId: 1,
            assignedAt: new Date(),
            permission: {
              id: 1,
              resource: 'users',
              action: 'read',
              description: 'Read users',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      };

      mockPrismaRole.findUnique.mockResolvedValue(mockModel);

      const result = await repository.findByIdWithPermissions(1);

      expect(result).toBeDefined();
      expect(result?.name).toBe('Admin');
      expect(result?.permissions).toHaveLength(1);
      expect(result?.permissions![0].resource).toBe('users');
    });

    it('should return null if role not found', async () => {
      mockPrismaRole.findUnique.mockResolvedValue(null);
      const result = await repository.findByIdWithPermissions(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a role with permissions atomically', async () => {
      const input = {
        name: 'New Role',
        description: 'Description',
        permissionIds: [1, 2],
      };

      const mockCreatedModel: RoleWithPermissionsModel = {
        id: 2,
        name: input.name,
        description: input.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        permissions: [], // simplification for test
      };

      mockPrismaRole.create.mockResolvedValue(mockCreatedModel);

      const result = await repository.create(input);

      expect(mockPrismaRole.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: input.name,
          permissions: {
            create: [{ permissionId: 1 }, { permissionId: 2 }],
          },
        }),
        include: expect.any(Object),
      });
      expect(result.name).toBe(input.name);
    });
  });

  describe('countUsersWithRole', () => {
    it('should count users assigned to a role', async () => {
      mockPrismaUserRole.count.mockResolvedValue(5);

      const count = await repository.countUsersWithRole(1);

      expect(mockPrismaUserRole.count).toHaveBeenCalledWith({
        where: { roleId: 1 },
      });
      expect(count).toBe(5);
    });
  });
});
