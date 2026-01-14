import { prisma } from '@config/prisma';
import { UsersPrismaRepository } from '@modules/users/infrastructure/persist/users-prisma.repository';
import { UserWithRolesModel } from '@modules/users/infrastructure/persist/include';
import { User } from '@prisma/client';
import { UserEntityModelMapper } from '@modules/users/infrastructure/persist/user-entity-model.mapper';

jest.mock('@config/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const mockPrismaUser = prisma.user as jest.Mocked<typeof prisma.user>;

describe('UsersPrismaRepository', () => {
  let repository: UsersPrismaRepository;

  beforeEach(() => {
    repository = new UsersPrismaRepository();
    jest.resetAllMocks();
  });

  describe('getUserWithRoles', () => {
    it('should return a user with roles when a valid id is provided', async () => {
      const mockUserModel: UserWithRolesModel = {
        id: 1,
        username: 'testuser',
        email: 'test@user.com',
        passwordHash: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        avatar: null,
        isActive: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: [
          {
            userId: 1,
            roleId: 1,
            assignedAt: new Date(),
            role: {
              id: 1,
              name: 'ADMIN',
              description: 'Administrator role',
              createdAt: new Date(),
              updatedAt: new Date(),
              permissions: [
                {
                  roleId: 1,
                  permissionId: 1,
                  assignedAt: new Date(),
                  permission: {
                    id: 1,
                    resource: 'user',
                    action: 'create',
                    description: 'Create users',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                },
              ],
            },
          },
        ],
      };

      mockPrismaUser.findUnique.mockResolvedValue(mockUserModel);

      const user = await repository.getUserWithRoles(1);

      expect(user).toBeDefined();
      expect(user).not.toBeNull();
      expect(user?.id).toBe(1);
      expect(user?.username).toBe('testuser');
      expect(user?.roles).toHaveLength(1);
      expect(user?.roles[0].name).toBe('ADMIN');
      expect(user?.roles[0].permissions).toHaveLength(1);
      expect(user?.roles[0].permissions[0].action).toBe('create');
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    });

    it('should return null when user is not found', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      const user = await repository.getUserWithRoles(999);

      expect(user).toBeNull();
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        include: expect.any(Object),
      });
    });
  });

  describe('findByUsername', () => {
    it('should return a user when a valid username is provided', async () => {
      const mockUserModel: User = {
        id: 1,
        username: 'testuser',
        email: 'test@user.com',
        passwordHash: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        avatar: null,
        isActive: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaUser.findUnique.mockResolvedValue(mockUserModel);

      const user = await repository.findByUsername('testuser');

      expect(user).toBeDefined();
      expect(user).not.toBeNull();
      expect(user?.id).toBe(1);
      expect(user?.username).toBe('testuser');
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(user).toEqual(UserEntityModelMapper.toEntity(mockUserModel));
    });

    it('should return null when username does not exist', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      const user = await repository.findByUsername('nonexistent');

      expect(user).toBeNull();
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { username: 'nonexistent' },
      });
    });
  });

  describe('findByIdForAuth', () => {
    it('should return an AuthUser when a valid id is provided', async () => {
      const mockUserModel: UserWithRolesModel = {
        id: 1,
        username: 'testuser',
        email: 'test@user.com',
        passwordHash: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        avatar: null,
        isActive: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: [
          {
            userId: 1,
            roleId: 1,
            assignedAt: new Date(),
            role: {
              id: 1,
              name: 'ADMIN',
              description: 'Administrator role',
              createdAt: new Date(),
              updatedAt: new Date(),
              permissions: [],
            },
          },
        ],
      };

      mockPrismaUser.findUnique.mockResolvedValue(mockUserModel);

      const user = await repository.findByIdForAuth(1);

      expect(user).toBeDefined();
      expect(user?.id).toBe(1);
      expect(user?.username).toBe('testuser');
      expect(user?.roles).toContain('ADMIN');
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: expect.any(Object), // We generally verify the include object structure elsewhere or broadly
      });
    });

    it('should return null when user is not found', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      const user = await repository.findByIdForAuth(999);

      expect(user).toBeNull();
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        include: expect.any(Object),
      });
    });
  });

  describe('findByUsernameForAuth', () => {
    it('should return an AuthUser when a valid username is provided', async () => {
      // Mock structure matching the specific include in findByUsernameForAuth
      const mockPrismaResponse = {
        id: 1,
        username: 'testuser',
        passwordHash: 'hashedpassword',
        isActive: 'ACTIVE',
        roles: [
          {
            role: {
              name: 'ADMIN',
            },
          },
        ],
      };

      mockPrismaUser.findUnique.mockResolvedValue(mockPrismaResponse as any);

      const user = await repository.findByUsernameForAuth('testuser');

      expect(user).toBeDefined();
      expect(user?.id).toBe(1);
      expect(user?.username).toBe('testuser');
      expect(user?.status).toBe('ACTIVE');
      expect(user?.roles).toContain('ADMIN');
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
    });

    it('should return null when user is not found', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      const user = await repository.findByUsernameForAuth('nonexistent');

      expect(user).toBeNull();
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { username: 'nonexistent' },
        include: expect.any(Object),
      });
    });
  });

  describe('getAll', () => {
    it('should return a list of users with applied filters', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', email: 'user1@test.com', isActive: 'ACTIVE', createdAt: new Date() },
        { id: 2, username: 'user2', email: 'user2@test.com', isActive: 'INACTIVE', createdAt: new Date() },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const filter = {
        username: 'user',
        email: '@test.com',
        status: 'ACTIVE' as const,
        roleId: 1,
        pagination: { limit: 10, offset: 0 },
      };

      const result = await repository.getAll(filter);

      expect(result).toHaveLength(2);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          username: { contains: 'user', mode: 'insensitive' },
          email: { contains: '@test.com', mode: 'insensitive' },
          isActive: 'ACTIVE',
          roles: {
            some: {
              roleId: 1,
            },
          },
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return all users when no filters are provided', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

      await repository.getAll({});

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {},
        skip: undefined,
        take: undefined,
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});

