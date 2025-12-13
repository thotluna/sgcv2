import { UserWithRolesEntity } from './user-entity';

export interface UsersService {
  getUserWithRoles(userId: number): Promise<UserWithRolesEntity | null>;
}
