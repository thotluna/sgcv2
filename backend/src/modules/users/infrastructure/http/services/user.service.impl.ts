import { UserWithRolesEntity } from '@modules/users/domain/user-entity';
import { UsersService } from '@modules/users/domain/user.service';
import { TYPES } from '@modules/users/di/types';
import { inject, injectable } from 'inversify';
import { UserRepository } from '@modules/users/domain/user-repository';

@injectable()
export class UserServiceImpl implements UsersService {
  constructor(@inject(TYPES.UserRepository) private readonly userRepository: UserRepository) {}

  async getUserWithRoles(userId: number): Promise<UserWithRolesEntity | null> {
    return await this.userRepository.getUserWithRoles(userId);
  }
}
