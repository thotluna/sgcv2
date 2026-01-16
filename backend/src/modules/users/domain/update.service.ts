import { UserWithRolesEntity } from './user-entity';

export interface UpdateUserService {
  update(id: number, data: Partial<UserWithRolesEntity>): Promise<UserWithRolesEntity>;
  getUserWithRoles(userId: number): Promise<UserWithRolesEntity | null>;
}
