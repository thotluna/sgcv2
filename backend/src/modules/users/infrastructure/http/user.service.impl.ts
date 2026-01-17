import { UserEntity, UserWithRolesEntity } from '@modules/users/domain/user-entity';
import { UsersService } from '@modules/users/domain/user.service';
import { TYPES } from '@modules/users/di/types';
import { inject, injectable } from 'inversify';
import { UserRepository } from '@modules/users/domain/user-repository';
import { ShowUserService } from '@modules/users/domain/show.service';
import { ListUsersService } from '@modules/users/domain/list.service';
import {
  CreateUserInput,
  UserFilterInput,
  PaginatedUsers,
} from '@modules/users/domain/dtos/user.dtos';
import { CreateUserService } from '@modules/users/domain/create.service';
import { UpdateUserService } from '@modules/users/domain/update.service';
import { UpdateUserPersistenceInput } from '@modules/users/domain/dtos/user.dtos';

@injectable()
export class UserServiceImpl
  implements UsersService, ShowUserService, ListUsersService, CreateUserService, UpdateUserService
{
  constructor(@inject(TYPES.UserRepository) private readonly userRepository: UserRepository) {}

  async findById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async getUserWithRoles(userId: number): Promise<UserWithRolesEntity | null> {
    const user = await this.userRepository.getUserWithRoles(userId);

    return user;
  }

  async getAll(filter: UserFilterInput): Promise<PaginatedUsers> {
    return this.userRepository.getAll(filter);
  }

  async update(id: number, data: UpdateUserPersistenceInput): Promise<UserWithRolesEntity> {
    return this.userRepository.update(id, data);
  }

  async updateUser(id: number, data: UpdateUserPersistenceInput): Promise<UserWithRolesEntity> {
    const updatedUser = await this.userRepository.update(id, data);
    return (await this.userRepository.getUserWithRoles(updatedUser.id))!;
  }

  async create(data: CreateUserInput): Promise<UserEntity> {
    return this.userRepository.create(data);
  }
}
