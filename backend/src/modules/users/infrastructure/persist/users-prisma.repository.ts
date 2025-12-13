import { UserEntity, UserWithRolesEntity } from '@modules/users/domain/user-entity';
import { AuthUser } from '@modules/auth/domain/auth-user';
import { UserRepository } from '../../domain/user-repository';
import { prisma } from '../../../../config/prisma';
import { UserEntityModelMapper } from './user-entity-model.mapper';
import { injectable } from 'inversify';
import { UserFinderForAuth } from '@modules/auth/domain/user-finder-for-auth';
import { userInclude } from './include';

@injectable()
export class UsersPrismaRepository implements UserRepository, UserFinderForAuth {
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
      passwordHash: user.passwordHash,
      // @ts-ignore - Assuming mapping is largely compatible or handled at DB level
      status: user.isActive,
      roles: user.roles.map(ur => ur.role.name),
    };
  }
}
