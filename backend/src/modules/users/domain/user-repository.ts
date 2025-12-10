import { UserEntity } from './user-entity';

export interface UserRepository {
  findByUsername(username: string): Promise<UserEntity | null>;
}
