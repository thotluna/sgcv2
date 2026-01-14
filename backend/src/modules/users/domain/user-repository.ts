import { UserFilterInput } from './dtos/user.dtos';
import { UserEntity, UserWithRolesEntity } from './user-entity';

export interface UserRepository {
  getAll(filter: UserFilterInput): Promise<UserEntity[]>;
  findByUsername(username: string): Promise<UserEntity | null>;
  getUserWithRoles(userId: number): Promise<UserWithRolesEntity | null>;
  update(id: number, data: Partial<UserEntity>): Promise<UserEntity>;
}
