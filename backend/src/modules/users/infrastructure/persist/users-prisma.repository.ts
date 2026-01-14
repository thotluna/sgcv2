import { prisma } from '@config/prisma';
import { injectable } from 'inversify';
import { userInclude } from './include';
import { UserEntity, UserWithRolesEntity } from '@users/domain/user-entity';
import { UserRepository } from '@users/domain/user-repository';
import { AuthUser } from '@auth/domain/auth-user';
import { UserCredentialsRepository } from '@modules/auth/domain/user-credentials.repository';
import { UserEntityModelMapper } from '@users/infrastructure/persist/user-entity-model.mapper';
import { UsersMapper } from '@users/infrastructure/mappers/users';
import { AuthUserIdentityRepository } from '@modules/auth/domain/auth-user-identity.repository';
import { UserStatus } from '@sgcv2/shared';
import {
  CreateUserInput,
  UserFilterInput,
  PaginatedUsers,
} from '@modules/users/domain/dtos/user.dtos';

@injectable()
export class UsersPrismaRepository
  implements UserRepository, UserCredentialsRepository, AuthUserIdentityRepository
{
  async findByIdForAuth(sub: number): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({ where: { id: sub }, include: userInclude });
    if (!user) return null;

    return UsersMapper.toAuthUser(user);
  }
  async getUserWithRoles(userId: number): Promise<UserWithRolesEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: userInclude,
    });

    if (!user) return null;

    return UserEntityModelMapper.toUserWithRolesDto(user);
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return UserEntityModelMapper.toEntity(user);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const userModel = await prisma.user.findUnique({ where: { username } });

    if (!userModel) {
      return null;
    }
    return UserEntityModelMapper.toEntity(userModel);
  }

  async findByUsernameForAuth(username: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      passwordHash: user.passwordHash,
      status: user.isActive as UserStatus,
      roles: user.roles.map(ur => ur.role.name),
    };
  }

  async getAll(filter: UserFilterInput): Promise<PaginatedUsers> {
    const { search, status, pagination } = filter;

    const where: any = {
      AND: [],
    };

    if (search) {
      where.AND.push({
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          {
            roles: {
              some: {
                role: {
                  name: { contains: search, mode: 'insensitive' },
                },
              },
            },
          },
        ],
      });
    }

    if (status) {
      where.AND.push({ isActive: status });
    }

    // If AND is empty, remove it to avoid empty filter issues
    if (where.AND.length === 0) {
      delete where.AND;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: pagination?.offset,
        take: pagination?.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users: users.map(user => UserEntityModelMapper.toEntity(user)),
      total,
    };
  }

  async update(id: number, data: any): Promise<UserWithRolesEntity> {
    const updateData: any = {};

    if (data.email !== undefined) updateData.email = data.email;
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;

    // Handle both isActive (from UpdateUserInput) and status (from UserEntity/UpdateMeInput)
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    else if (data.status !== undefined) updateData.isActive = data.status;

    // Handle both password (to be hashed or already hashed) and passwordHash
    if (data.password !== undefined) updateData.passwordHash = data.password;
    else if (data.passwordHash !== undefined) updateData.passwordHash = data.passwordHash;

    if (data.roleIds) {
      updateData.roles = {
        deleteMany: {},
        create: data.roleIds.map((roleId: number) => ({
          roleId,
        })),
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: userInclude,
    });

    return UserEntityModelMapper.toUserWithRolesDto(updatedUser);
  }

  async create(data: CreateUserInput): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash: data.password, // This will be the hash coming from the use case
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        isActive: data.isActive || 'ACTIVE',
      },
    });

    return UserEntityModelMapper.toEntity(user);
  }
}
