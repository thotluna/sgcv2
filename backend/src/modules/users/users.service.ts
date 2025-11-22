import { prisma } from '../../config/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class UsersService {
  /**
   * Find user by ID
   */
  async findById(id: number) {
    return await prisma.usuario.findUnique({
      where: { id_usuario: id },
      select: {
        id_usuario: true,
        username: true,
        email: true,
        estado: true,
        fecha_ultimo_acceso: true,
        created_at: true,
        updated_at: true,
        empleado: {
          select: {
            id_empleado: true,
            nombre: true,
            apellido: true,
            telefono: true,
            email: true,
            cargo: true,
            foto: true, // Photo comes from employee
          },
        },
      },
    });
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string) {
    return await prisma.usuario.findUnique({
      where: { username },
      select: {
        id_usuario: true,
        username: true,
        email: true,
        estado: true,
        created_at: true,
        empleado: {
          select: {
            id_empleado: true,
            nombre: true,
            apellido: true,
            telefono: true,
            email: true,
            foto: true,
          },
        },
      },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    return await prisma.usuario.findUnique({
      where: { email },
      select: {
        id_usuario: true,
        username: true,
        email: true,
        estado: true,
        created_at: true,
        empleado: {
          select: {
            id_empleado: true,
            nombre: true,
            apellido: true,
            foto: true,
          },
        },
      },
    });
  }

  /**
   * Get user with roles and permissions
   */
  async getUserWithRoles(id: number) {
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: id },
      include: {
        empleado: {
          select: {
            id_empleado: true,
            nombre: true,
            apellido: true,
            telefono: true,
            email: true,
            cargo: true,
            departamento: true,
            foto: true,
          },
        },
        usuario_rol: {
          include: {
            rol: {
              include: {
                rol_permiso: {
                  include: {
                    permiso: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    // Transform to a cleaner structure
    const roles = user.usuario_rol.map(ur => ({
      id: ur.rol.id_rol,
      name: ur.rol.nombre_rol,
      description: ur.rol.descripcion,
    }));

    const permissions = user.usuario_rol.flatMap(ur =>
      ur.rol.rol_permiso.map(rp => ({
        id: rp.permiso.id_permiso,
        module: rp.permiso.modulo,
        action: rp.permiso.accion,
        description: rp.permiso.descripcion,
      }))
    );

    // Remove duplicates from permissions
    const uniquePermissions = Array.from(new Map(permissions.map(p => [p.id, p])).values());

    const { password_hash, usuario_rol, ...userData } = user;

    return {
      ...userData,
      roles,
      permissions: uniquePermissions,
    };
  }

  /**
   * Get all users (with pagination)
   */
  async findAll(page = 1, limit = 10, filters?: { estado?: 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO' }) {
    const skip = (page - 1) * limit;

    const where = filters?.estado ? { estado: filters.estado } : {};

    const [users, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
        skip,
        take: limit,
        select: {
          id_usuario: true,
          username: true,
          email: true,
          estado: true,
          created_at: true,
          updated_at: true,
          empleado: {
            select: {
              nombre: true,
              apellido: true,
              cargo: true,
              foto: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.usuario.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserDto) {
    // Check if username already exists
    const existingUsername = await prisma.usuario.findUnique({
      where: { username: data.username },
    });

    if (existingUsername) {
      throw new Error('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Hash password
    const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user
    const user = await prisma.usuario.create({
      data: {
        username: data.username,
        email: data.email,
        password_hash,
        id_empleado: data.id_empleado,
        estado: 'ACTIVO',
      },
      select: {
        id_usuario: true,
        username: true,
        email: true,
        estado: true,
        created_at: true,
        empleado: {
          select: {
            nombre: true,
            apellido: true,
            foto: true,
          },
        },
      },
    });

    // Assign roles if provided
    if (data.roleIds && data.roleIds.length > 0) {
      await prisma.usuario_rol.createMany({
        data: data.roleIds.map(roleId => ({
          id_usuario: user.id_usuario,
          id_rol: roleId,
        })),
      });
    }

    return user;
  }

  /**
   * Update user
   */
  async updateUser(id: number, data: UpdateUserDto) {
    // Check if user exists
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if email is being updated and if it already exists
    if (data.email && data.email !== user.email) {
      const existingEmail = await prisma.usuario.findUnique({
        where: { email: data.email },
      });

      if (existingEmail) {
        throw new Error('Email already exists');
      }
    }

    // Prepare update data
    const updateData: any = {
      email: data.email,
      estado: data.estado,
    };

    // Hash new password if provided
    if (data.password) {
      updateData.password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    // Update user
    const updatedUser = await prisma.usuario.update({
      where: { id_usuario: id },
      data: updateData,
      select: {
        id_usuario: true,
        username: true,
        email: true,
        estado: true,
        updated_at: true,
        empleado: {
          select: {
            nombre: true,
            apellido: true,
            foto: true,
          },
        },
      },
    });

    // Update roles if provided
    if (data.roleIds !== undefined) {
      // Delete existing roles
      await prisma.usuario_rol.deleteMany({
        where: { id_usuario: id },
      });

      // Create new roles
      if (data.roleIds.length > 0) {
        await prisma.usuario_rol.createMany({
          data: data.roleIds.map(roleId => ({
            id_usuario: id,
            id_rol: roleId,
          })),
        });
      }
    }

    return updatedUser;
  }

  /**
   * Delete user (soft delete by setting estado = INACTIVO)
   */
  async deleteUser(id: number) {
    return await prisma.usuario.update({
      where: { id_usuario: id },
      data: { estado: 'INACTIVO' },
      select: {
        id_usuario: true,
        username: true,
        estado: true,
      },
    });
  }

  /**
   * Hard delete user (use with caution)
   */
  async hardDeleteUser(id: number) {
    // Delete user roles first
    await prisma.usuario_rol.deleteMany({
      where: { id_usuario: id },
    });

    // Delete user
    return await prisma.usuario.delete({
      where: { id_usuario: id },
    });
  }
}
