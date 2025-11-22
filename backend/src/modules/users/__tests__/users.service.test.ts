import { UsersService } from '../users.service';
import { prisma } from '../../../config/prisma';
import bcrypt from 'bcrypt';

// Mock prisma
jest.mock('../../../config/prisma', () => ({
  prisma: {
    usuario: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    usuario_rol: {
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
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService();
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const mockUser = {
        id_usuario: 1,
        username: 'testuser',
        email: 'test@example.com',
        estado: 'ACTIVO',
        empleado: {
          nombre: 'Test',
          apellido: 'User',
        },
      };

      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findById(1);

      expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { id_usuario: 1 },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

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
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const mockCreatedUser = {
        id_usuario: 1,
        username: createDto.username,
        email: createDto.email,
        estado: 'ACTIVO',
      };

      (prisma.usuario.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await service.createUser(createDto);

      expect(prisma.usuario.findUnique).toHaveBeenCalledTimes(2); // Check username and email
      expect(bcrypt.hash).toHaveBeenCalledWith(createDto.password, 10);
      expect(prisma.usuario.create).toHaveBeenCalled();
      expect(prisma.usuario_rol.createMany).toHaveBeenCalledWith({
        data: [{ id_usuario: 1, id_rol: 1 }],
      });
      expect(result).toEqual(mockCreatedUser);
    });

    it('should throw error if username exists', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValueOnce({ id_usuario: 1 });

      await expect(service.createUser(createDto)).rejects.toThrow('Username already exists');
    });

    it('should throw error if email exists', async () => {
      (prisma.usuario.findUnique as jest.Mock)
        .mockResolvedValueOnce(null) // Username check
        .mockResolvedValueOnce({ id_usuario: 1 }); // Email check

      await expect(service.createUser(createDto)).rejects.toThrow('Email already exists');
    });
  });

  describe('updateUser', () => {
    const updateDto = {
      email: 'updated@example.com',
      estado: 'INACTIVO' as const,
    };

    it('should update user successfully', async () => {
      const mockUser = { id_usuario: 1, email: 'old@example.com' };
      (prisma.usuario.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockUser) // Check user exists
        .mockResolvedValueOnce(null); // Check email uniqueness

      const mockUpdatedUser = { ...mockUser, ...updateDto };
      (prisma.usuario.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await service.updateUser(1, updateDto);

      expect(prisma.usuario.update).toHaveBeenCalledWith({
        where: { id_usuario: 1 },
        data: expect.objectContaining({
          email: updateDto.email,
          estado: updateDto.estado,
        }),
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw error if user not found', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateUser(999, updateDto)).rejects.toThrow('User not found');
    });
  });

  describe('findByUsername', () => {
    it('should return user if found', async () => {
      const mockUser = { id_usuario: 1, username: 'test' };
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByUsername('test');

      expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { username: 'test' },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should return user if found', async () => {
      const mockUser = { id_usuario: 1, email: 'test@example.com' };
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserWithRoles', () => {
    it('should return user with roles and permissions', async () => {
      const mockUser = {
        id_usuario: 1,
        username: 'test',
        password_hash: 'hash',
        usuario_rol: [
          {
            rol: {
              id_rol: 1,
              nombre_rol: 'Admin',
              descripcion: 'Admin role',
              rol_permiso: [
                {
                  permiso: {
                    id_permiso: 1,
                    modulo: 'users',
                    accion: 'read',
                    descripcion: 'Read users',
                  },
                },
              ],
            },
          },
        ],
      };

      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.getUserWithRoles(1);

      expect(result).toBeDefined();
      expect(result?.roles).toHaveLength(1);
      expect(result?.permissions).toHaveLength(1);
      expect(result?.roles[0].name).toBe('Admin');
    });

    it('should return null if user not found', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.getUserWithRoles(999);

      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should soft delete user', async () => {
      const mockDeletedUser = { id_usuario: 1, estado: 'INACTIVO' };
      (prisma.usuario.update as jest.Mock).mockResolvedValue(mockDeletedUser);

      const result = await service.deleteUser(1);

      expect(prisma.usuario.update).toHaveBeenCalledWith({
        where: { id_usuario: 1 },
        data: { estado: 'INACTIVO' },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockDeletedUser);
    });
  });

  describe('hardDeleteUser', () => {
    it('should hard delete user and roles', async () => {
      const mockDeletedUser = { id_usuario: 1 };
      (prisma.usuario.delete as jest.Mock).mockResolvedValue(mockDeletedUser);

      const result = await service.hardDeleteUser(1);

      expect(prisma.usuario_rol.deleteMany).toHaveBeenCalledWith({
        where: { id_usuario: 1 },
      });
      expect(prisma.usuario.delete).toHaveBeenCalledWith({
        where: { id_usuario: 1 },
      });
      expect(result).toEqual(mockDeletedUser);
    });
  });
});
