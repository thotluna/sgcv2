import { UserEntity } from '@modules/users/domain/user-entity';

export interface UserFinderForAuth {
  findByUsername(username: string): Promise<UserEntity | null>;
}
