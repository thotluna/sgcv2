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

  async update(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        isActive: data.status,
        passwordHash: data.passwordHash,
      },
    });

    return UserEntityModelMapper.toEntity(updatedUser);
  }
}
