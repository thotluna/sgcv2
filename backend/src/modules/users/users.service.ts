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
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  /**
   * Get user with roles and permissions
   */
  async getUserWithRoles(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
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

    if (!user) return null;

    // Transform to a cleaner structure
    const roles = user.roles.map(ur => ({
      id: ur.role.id,
      name: ur.role.name,
      description: ur.role.description,
    }));

    const permissions = user.roles.flatMap(ur =>
      ur.role.permissions.map(rp => ({
        id: rp.permission.id,
        resource: rp.permission.resource,
        action: rp.permission.action,
        description: rp.permission.description,
      }))
    );

    // Remove duplicates from permissions
    const uniquePermissions = Array.from(new Map(permissions.map(p => [p.id, p])).values());

    const { passwordHash, roles: userRoles, ...userData } = user;

    return {
      ...userData,
      roles,
      permissions: uniquePermissions,
    };
  }

  /**
   * Get all users (with pagination)
   */
  async findAll(page = 1, limit = 10, filters?: { isActive?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' }) {
    const skip = (page - 1) * limit;

    const where = filters?.isActive !== undefined ? { isActive: filters.isActive } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          email: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
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
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUsername) {
      throw new Error('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash,
        isActive: 'ACTIVE',
      },
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Assign roles if provided
    if (data.roleIds && data.roleIds.length > 0) {
      await prisma.userRole.createMany({
        data: data.roleIds.map(roleId => ({
          userId: user.id,
          roleId: roleId,
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
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if email is being updated and if it already exists
    if (data.email && data.email !== user.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingEmail) {
        throw new Error('Email already exists');
      }
    }

    // Prepare update data
    const updateData: any = {
      email: data.email,
      isActive: data.isActive,
    };

    // Hash new password if provided
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        updatedAt: true,
      },
    });

    // Update roles if provided
    if (data.roleIds !== undefined) {
      // Delete existing roles
      await prisma.userRole.deleteMany({
        where: { userId: id },
      });

      // Create new roles
      if (data.roleIds.length > 0) {
        await prisma.userRole.createMany({
          data: data.roleIds.map(roleId => ({
            userId: id,
            roleId: roleId,
          })),
        });
      }
    }

    return updatedUser;
  }

  /**
   * Delete user (soft delete by setting isActive = false)
   */
  async deleteUser(id: number) {
    return await prisma.user.update({
      where: { id },
      data: { isActive: 'INACTIVE' },
      select: {
        id: true,
        username: true,
        isActive: true,
      },
    });
  }

  /**
   * Hard delete user (use with caution)
   */
  async hardDeleteUser(id: number) {
    // Delete user roles first (cascade should handle it but explicit is safer if cascade not set, though schema has cascade)
    // Actually schema has onDelete: Cascade, so deleting user deletes user_roles automatically.
    // But let's keep it simple.

    // Delete user
    return await prisma.user.delete({
      where: { id },
    });
  }
}
