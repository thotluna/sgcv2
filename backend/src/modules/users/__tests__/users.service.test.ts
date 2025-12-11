import { UsersServiceImp } from '../users.service';
import { prisma } from '../../../config/prisma';
import bcrypt from 'bcrypt';
import { UpdateUserDto } from '@sgcv2/shared';

// Mock prisma
jest.mock('../../../config/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    userRole: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersServiceImp;

  beforeEach(() => {
    service = new UsersServiceImp();
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        isActive: true,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findById(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    const createDto = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
      roleIds: [1],
    };

    it('should create a new user successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const mockCreatedUser = {
        id: 1,
        username: createDto.username,
        email: createDto.email,
        isActive: true,
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await service.createUser(createDto);

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(2); // Check username and email
      expect(bcrypt.hash).toHaveBeenCalledWith(createDto.password, 10);
      expect(prisma.user.create).toHaveBeenCalled();
      expect(prisma.userRole.createMany).toHaveBeenCalledWith({
        data: [{ userId: 1, roleId: 1 }],
      });
      expect(result).toEqual(mockCreatedUser);
    });

    it('should throw error if username exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1 });

      await expect(service.createUser(createDto)).rejects.toThrow('Username already exists');
    });

    it('should throw error if email exists', async () => {
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(null) // Username check
        .mockResolvedValueOnce({ id: 1 }); // Email check

      await expect(service.createUser(createDto)).rejects.toThrow('Email already exists');
    });
  });

  describe('updateUser', () => {
    const updateDto: UpdateUserDto = {
      email: 'updated@example.com',
      isActive: 'ACTIVE',
    };

    it('should update user successfully', async () => {
      const mockUser = { id: 1, email: 'old@example.com' };
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockUser) // Check user exists
        .mockResolvedValueOnce(null); // Check email uniqueness

      const mockUpdatedUser = { ...mockUser, ...updateDto };
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await service.updateUser(1, updateDto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          email: updateDto.email,
          isActive: updateDto.isActive,
        }),
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateUser(999, updateDto)).rejects.toThrow('User not found');
    });
  });

  describe('findByUsername', () => {
    it('should return user if found', async () => {
      const mockUser = { id: 1, username: 'test' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByUsername('test');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'test' },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should return user if found', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserWithRoles', () => {
    it('should return user with roles and permissions', async () => {
      const mockUser = {
        id: 1,
        username: 'test',
        email: 'test@example.com',
        isActive: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordHash: 'hash',
        firstName: null,
        lastName: null,
        roles: [
          {
            role: {
              id: 1,
              name: 'Admin',
              description: 'Admin role',
              permissions: [
                {
                  permission: {
                    id: 1,
                    resource: 'users',
                    action: 'read',
                    description: 'Read users',
                  },
                },
              ],
            },
          },
        ],
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.getUserWithRoles(1);

      expect(result).toBeDefined();
      expect(result?.user).toBeDefined();
      expect(result?.roles).toHaveLength(1);
      expect(result?.permissions).toHaveLength(1);
      expect(result?.roles[0].name).toBe('Admin');
    });

    it('should return null if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.getUserWithRoles(999);

      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should soft delete user', async () => {
      const mockDeletedUser = { id: 1, isActive: 'INACTIVE' };
      (prisma.user.update as jest.Mock).mockResolvedValue(mockDeletedUser);

      const result = await service.deleteUser(1);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isActive: 'INACTIVE' },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockDeletedUser);
    });
  });

  describe('hardDeleteUser', () => {
    it('should hard delete user', async () => {
      const mockDeletedUser = { id: 1 };
      (prisma.user.delete as jest.Mock).mockResolvedValue(mockDeletedUser);

      const result = await service.hardDeleteUser(1);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockDeletedUser);
    });
  });
});
