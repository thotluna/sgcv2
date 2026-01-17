import { UserEntity, UserWithRolesEntity } from './user-entity';

export interface UsersService {
  findById(id: number): Promise<UserEntity | null>;
  getUserWithRoles(userId: number): Promise<UserWithRolesEntity | null>;
  update(id: number, data: any): Promise<UserEntity>;
}
