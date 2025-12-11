import { UserEntity } from '@modules/users/domain/user-entity';
import { UserRepository } from '../../domain/user-repository';
import { prisma } from '../../../../config/prisma';
import { UserEntityModelMapper } from './user-entity-model.mapper';
import { injectable } from 'inversify';

@injectable()
export class UsersPrismaRepository implements UserRepository {
  async findByUsername(username: string): Promise<UserEntity | null> {
    const userModel = await prisma.user.findUnique({ where: { username } });

    if (!userModel) {
      return null;
    }
    return UserEntityModelMapper.toEntity(userModel);
  }
}
