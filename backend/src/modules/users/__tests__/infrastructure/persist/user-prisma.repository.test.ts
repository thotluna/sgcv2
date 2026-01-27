import { prisma } from '@config/prisma';
import { UserWithRolesModel } from '@modules/users/infrastructure/persist/include';
import { UserEntityModelMapper } from '@modules/users/infrastructure/persist/user-entity-model.mapper';
import { UsersPrismaRepository } from '@modules/users/infrastructure/persist/users-prisma.repository';
import { User } from '@prisma/client';

jest.mock('@config/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
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
        status: 'ACTIVE',
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
      const role = user?.roles?.[0];
      expect(role).toBeDefined();
      expect(role!.name).toBe('ADMIN');
      expect(role!.permissions).toBeDefined();
      expect(role!.permissions).toHaveLength(1);
      expect(role!.permissions![0].action).toBe('create');
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
        status: 'ACTIVE',
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
      const mockUserModel: any = {
        id: 1,
        username: 'testuser',
        email: 'test@user.com',
        passwordHash: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        avatar: null,
        status: 'ACTIVE',
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
                  permission: {
                    resource: 'users',
                    action: 'read',
                  },
                },
              ],
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
      expect(user?.permissions).toContain('users.read');
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: expect.any(Object),
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
        email: 'test@user.com',
        firstName: 'Test',
        lastName: 'User',
        passwordHash: 'hashedpassword',
        status: 'ACTIVE',
        roles: [
          {
            role: {
              id: 1,
              name: 'ADMIN',
              permissions: [
                {
                  permission: {
                    resource: 'users',
                    action: 'read',
                  },
                },
              ],
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
      expect(user?.permissions).toContain('users.read');
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
        include: expect.any(Object),
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
        {
          id: 1,
          username: 'user1',
          email: 'user1@test.com',
          status: 'ACTIVE',
          createdAt: new Date(),
        },
        {
          id: 2,
          username: 'user2',
          email: 'user2@test.com',
          status: 'INACTIVE',
          createdAt: new Date(),
        },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
      (prisma.user.count as jest.Mock).mockResolvedValue(2);

      const filter = {
        search: 'user',
        status: 'ACTIVE' as const,
        pagination: { limit: 10, offset: 0 },
      };

      const result = await repository.getAll(filter);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          AND: [
            {
              OR: [
                { username: { contains: 'user', mode: 'insensitive' } },
                { email: { contains: 'user', mode: 'insensitive' } },
                {
                  roles: {
                    some: {
                      role: {
                        name: { contains: 'user', mode: 'insensitive' },
                      },
                    },
                  },
                },
              ],
            },
            { status: 'ACTIVE' },
          ],
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return all users when no filters are provided', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.user.count as jest.Mock).mockResolvedValue(0);

      const result = await repository.getAll({});

      expect(result.total).toBe(0);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {},
        skip: undefined,
        take: undefined,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('update', () => {
    it('should update a user and return the entity', async () => {
      const mockUserModel: any = {
        id: 1,
        username: 'testuser',
        email: 'updated@test.com',
        passwordHash: 'hashed',
        firstName: 'Updated',
        lastName: 'User',
        avatar: null,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: [],
      };
      mockPrismaUser.update.mockResolvedValue(mockUserModel);

      const result = await repository.update(1, { email: 'updated@test.com' });

      expect(result.email).toBe('updated@test.com');
      expect(mockPrismaUser.update).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a user and return the entity', async () => {
      const createData = {
        username: 'newuser',
        email: 'newuser@test.com',
        password: 'hashedpassword',
        firstName: 'New',
        lastName: 'User',
        status: 'ACTIVE' as const,
      };
      const mockUserModel: User = {
        id: 2,
        username: createData.username,
        email: createData.email,
        passwordHash: createData.password,
        firstName: createData.firstName,
        lastName: createData.lastName,
        avatar: null,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaUser.create.mockResolvedValue(mockUserModel);

      const result = await repository.create(createData);

      expect(result.username).toBe('newuser');
      expect(mockPrismaUser.create).toHaveBeenCalledWith({
        data: {
          username: createData.username,
          email: createData.email,
          passwordHash: createData.password,
          firstName: createData.firstName,
          lastName: createData.lastName,
          avatar: undefined,
          status: createData.status,
        },
      });
    });
  });
});
