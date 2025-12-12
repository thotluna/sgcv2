import { UserEntity, UserWithRolesEntity } from '@modules/users/domain/user-entity';
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
}
