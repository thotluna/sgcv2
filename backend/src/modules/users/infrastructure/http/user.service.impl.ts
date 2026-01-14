import { UserEntity, UserWithRolesEntity } from '@modules/users/domain/user-entity';
import { UsersService } from '@modules/users/domain/user.service';
import { TYPES } from '@modules/users/di/types';
import { inject, injectable } from 'inversify';
import { UserRepository } from '@modules/users/domain/user-repository';
import { ShowMeService } from '@modules/users/domain/show-me.service';
import { ListUsersService } from '@modules/users/domain/list.service';
import { UserFilterInput } from '@modules/users/domain/dtos/user.dtos';

@injectable()
export class UserServiceImpl implements UsersService, ShowMeService, ListUsersService {
  constructor(@inject(TYPES.UserRepository) private readonly userRepository: UserRepository) { }


  async getUserWithRoles(userId: number): Promise<UserWithRolesEntity | null> {
    const user = await this.userRepository.getUserWithRoles(userId);

    return user;
  }

  async getAll(filter: UserFilterInput): Promise<UserEntity[]> {
    return this.userRepository.getAll(filter)
  }

  async updateUser(id: number, data: Partial<UserWithRolesEntity>): Promise<UserWithRolesEntity> {
    const updatedUser = await this.userRepository.update(id, data);
    return (await this.userRepository.getUserWithRoles(updatedUser.id))!;
  }
}
